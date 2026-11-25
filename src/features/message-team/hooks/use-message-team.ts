"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { messageTeamService } from "../services/message-team.service";
import { ChatChannelType, ChatMessage, TeamMember } from "../types/message-team.types";

export function useMessageTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string>("");
  const [channelFilter, setChannelFilter] = useState<"all" | ChatChannelType>("all");
  const [contactSearch, setContactSearch] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isWsConnected, setIsWsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      const data = await messageTeamService.getTeamMembers();
      if (data && Array.isArray(data)) {
        setMembers(data);
        setActiveMemberId((prev) => {
          if (prev && data.some((m) => String(m.id) === String(prev))) {
            return prev;
          }
          // Prefer first direct-staff attendee chat if available, else first item
          const firstDirect = data.find((m) => m.channelType === "direct-staff");
          return firstDirect?.id ? String(firstDirect.id) : (data[0]?.id ? String(data[0].id) : "");
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle incoming real-time WebSocket message
  const handleIncomingWsMessage = useCallback((payload: any) => {
    if (!payload || payload.type !== "new_message" || !payload.message) return;

    const incomingMsg: ChatMessage = payload.message;
    const targetId =
      payload.channel_type === "event-group"
        ? String(payload.member_id)
        : String(payload.attendee_id || `conv-${payload.conversation_id}`);

    setMembers((prevMembers) => {
      const existingIndex = prevMembers.findIndex(
        (m) => String(m.id) === targetId || (payload.conversation_id && String((m as any).conversationId) === String(payload.conversation_id))
      );

      if (existingIndex !== -1) {
        const updated = [...prevMembers];
        const target = updated[existingIndex];
        const existingMsgs = target.messages || [];

        // Deduplicate by server message id
        if (existingMsgs.some((m) => String(m.id) === String(incomingMsg.id))) {
          return prevMembers;
        }

        // Replace matching optimistic message if any
        const cleanedMsgs = existingMsgs.filter(
          (m) => !(String(m.id).startsWith("temp-") && m.text === incomingMsg.text && m.isSender === incomingMsg.isSender)
        );

        const nextMember: TeamMember = {
          ...target,
          lastMessage: incomingMsg.isSender ? `Staff: ${incomingMsg.text}` : incomingMsg.text,
          lastMessageTime: incomingMsg.timestamp,
          unreadCount: incomingMsg.isSender ? target.unreadCount : (target.unreadCount || 0) + 1,
          messages: [...cleanedMsgs, incomingMsg],
        };

        updated[existingIndex] = nextMember;
        return updated;
      }

      // Brand new attendee initiated a chat — add them to the top of the list
      const newMember: TeamMember = {
        id: targetId,
        name: payload.attendee_email || payload.attendee_display_name || "Attendee",
        displayName: payload.attendee_display_name || "Attendee",
        email: payload.attendee_email || "",
        avatar: payload.attendee_avatar || "/fallback_avatar.png",
        role: payload.attendee_role || "Attendee",
        online: true,
        channelType: payload.channel_type || "direct-staff",
        eventName: payload.event_name || undefined,
        lastMessage: incomingMsg.text,
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

    // Light fallback sync every 30 seconds in case of transient network drop
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
      const matchesSearch =
        (m.displayName || "").toLowerCase().includes(contactSearch.toLowerCase()) ||
        (m.name || "").toLowerCase().includes(contactSearch.toLowerCase()) ||
        (m.lastMessage || "").toLowerCase().includes(contactSearch.toLowerCase());

      const matchesChannel =
        channelFilter === "all" || m.channelType === channelFilter;

      return matchesSearch && matchesChannel;
    });
  }, [members, contactSearch, channelFilter]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeMemberId) return;

    const textToSend = inputMessage.trim();
    setInputMessage("");

    // Optimistic UI update
    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: "admin",
      senderName: "RealSuccess Staff",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSender: true,
    };

    setMembers((prevMembers) =>
      prevMembers.map((m) => {
        if (String(m.id) === String(activeMemberId)) {
          return {
            ...m,
            lastMessage: `Staff: ${textToSend}`,
            lastMessageTime: tempMsg.timestamp,
            messages: [...(m.messages || []), tempMsg],
          };
        }
        return m;
      })
    );

    // Send via live WebSocket if open, otherwise fallback to REST API
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat_message",
          member_id: activeMemberId,
          text: textToSend,
          attachment_url: "",
        })
      );
    } else {
      const sent = await messageTeamService.sendMessage(activeMemberId, textToSend);
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
    channelFilter,
    setChannelFilter,
    contactSearch,
    setContactSearch,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    isLoading,
    isWsConnected,
  };
}
