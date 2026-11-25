"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { messageTeamService } from "../services/message-team.service";
import { ChatMessage, TeamMember } from "../types/message-team.types";

export interface PendingAttachment {
  url: string;
  filename: string;
}

export function useMessageTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string>("");
  const [contactSearch, setContactSearch] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWsConnected, setIsWsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      const data = await messageTeamService.getTeamMembers();
      if (data && Array.isArray(data)) {
        // Only show direct attendee chats in admin dashboard
        const attendeeChats = data.filter((m) => m.channelType !== "event-group");
        setMembers(attendeeChats);
        setActiveMemberId((prev) => {
          if (prev && attendeeChats.some((m) => String(m.id) === String(prev))) {
            return prev;
          }
          return attendeeChats[0]?.id ? String(attendeeChats[0].id) : "";
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle incoming real-time WebSocket message
  const handleIncomingWsMessage = useCallback((payload: any) => {
    if (!payload || payload.type !== "new_message" || !payload.message) return;
    if (payload.channel_type === "event-group") return;

    const incomingMsg: ChatMessage = payload.message;
    const targetId = String(payload.attendee_id || `conv-${payload.conversation_id}`);

    setMembers((prevMembers) => {
      const existingIndex = prevMembers.findIndex(
        (m) =>
          String(m.id) === targetId ||
          (payload.conversation_id && String((m as any).conversationId) === String(payload.conversation_id))
      );

      const previewText = incomingMsg.text || (incomingMsg.attachment_url ? "📎 Attachment" : "");

      if (existingIndex !== -1) {
        const updated = [...prevMembers];
        const target = updated[existingIndex];
        const existingMsgs = target.messages || [];

        if (existingMsgs.some((m) => String(m.id) === String(incomingMsg.id))) {
          return prevMembers;
        }

        const cleanedMsgs = existingMsgs.filter(
          (m) =>
            !(
              String(m.id).startsWith("temp-") &&
              m.text === incomingMsg.text &&
              (m.attachment_url || "") === (incomingMsg.attachment_url || "") &&
              m.isSender === incomingMsg.isSender
            )
        );

        const nextMember: TeamMember = {
          ...target,
          lastMessage: incomingMsg.isSender ? `Staff: ${previewText}` : previewText,
          lastMessageTime: incomingMsg.timestamp,
          unreadCount: incomingMsg.isSender ? target.unreadCount : (target.unreadCount || 0) + 1,
          messages: [...cleanedMsgs, incomingMsg],
        };

        updated[existingIndex] = nextMember;
        return updated;
      }

      const newMember: TeamMember = {
        id: targetId,
        name: payload.attendee_email || payload.attendee_display_name || "Attendee",
        displayName: payload.attendee_display_name || "Attendee",
        email: payload.attendee_email || "",
        avatar: payload.attendee_avatar || "/fallback_avatar.png",
        role: payload.attendee_role || "Attendee",
        online: true,
        channelType: "direct-staff",
        eventName: payload.event_name || undefined,
        lastMessage: previewText,
        lastMessageTime: incomingMsg.timestamp,
        unreadCount: incomingMsg.isSender ? 0 : 1,
        messages: [incomingMsg],
      };

      return [newMember, ...prevMembers];
    });
  }, []);

  useEffect(() => {
    fetchMembers();

    let isUnmounted = false;

    const connectWebSocket = () => {
      const wsUrl = messageTeamService.getWebSocketUrl();
      if (!wsUrl || isUnmounted) return;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isUnmounted) {
            setIsWsConnected(true);
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "new_message") {
              handleIncomingWsMessage(data);
            }
          } catch (err) {
            console.error("Failed to parse WebSocket message:", err);
          }
        };

        ws.onclose = () => {
          if (!isUnmounted) {
            setIsWsConnected(false);
            wsRef.current = null;
            reconnectTimerRef.current = setTimeout(connectWebSocket, 3000);
          }
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch (err) {
        console.error("WebSocket connection error:", err);
      }
    };

    connectWebSocket();
    const fallbackInterval = setInterval(fetchMembers, 30000);

    return () => {
      isUnmounted = true;
      clearInterval(fallbackInterval);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [fetchMembers, handleIncomingWsMessage]);

  const activeMember = useMemo(() => {
    return members.find((m) => String(m.id) === String(activeMemberId)) || members[0] || null;
  }, [members, activeMemberId]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = contactSearch.toLowerCase();
      return (
        (m.displayName || "").toLowerCase().includes(q) ||
        (m.name || "").toLowerCase().includes(q) ||
        (m.lastMessage || "").toLowerCase().includes(q)
      );
    });
  }, [members, contactSearch]);

  const handleAttachmentUpload = async (file: File) => {
    setIsUploadingAttachment(true);
    try {
      const uploaded = await messageTeamService.uploadAttachment(file);
      if (uploaded) {
        setPendingAttachment(uploaded);
      }
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const clearPendingAttachment = () => {
    setPendingAttachment(null);
  };

  const handleSendMessage = async () => {
    const textToSend = inputMessage.trim();
    const attachmentUrl = pendingAttachment?.url || "";

    if ((!textToSend && !attachmentUrl) || !activeMemberId) return;

    setInputMessage("");
    setPendingAttachment(null);

    const previewText = textToSend || "📎 Attachment";

    // Optimistic UI update
    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: "admin",
      senderName: "RealSuccess Staff",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSender: true,
      attachment_url: attachmentUrl,
    };

    setMembers((prevMembers) =>
      prevMembers.map((m) => {
        if (String(m.id) === String(activeMemberId)) {
          return {
            ...m,
            lastMessage: `Staff: ${previewText}`,
            lastMessageTime: tempMsg.timestamp,
            messages: [...(m.messages || []), tempMsg],
          };
        }
        return m;
      })
    );

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat_message",
          member_id: activeMemberId,
          text: textToSend,
          attachment_url: attachmentUrl,
        })
      );
    } else {
      const sent = await messageTeamService.sendMessage(activeMemberId, textToSend, attachmentUrl);
      if (sent) {
        fetchMembers();
      }
    }
  };

  return {
    members: filteredMembers,
    activeMember,
    activeMemberId,
    setActiveMemberId,
    contactSearch,
    setContactSearch,
    inputMessage,
    setInputMessage,
    pendingAttachment,
    isUploadingAttachment,
    handleAttachmentUpload,
    clearPendingAttachment,
    handleSendMessage,
    isLoading,
    isWsConnected,
  };
}
