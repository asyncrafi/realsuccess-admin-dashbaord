"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { messageTeamService } from "../services/message-team.service";
import { ChatChannelType, ChatMessage, TeamMember } from "../types/message-team.types";

export function useMessageTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string>("");
  const [channelFilter, setChannelFilter] = useState<"all" | ChatChannelType>("all");
  const [contactSearch, setContactSearch] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    try {
      const data = await messageTeamService.getTeamMembers();
      if (data && Array.isArray(data)) {
        setMembers(data);
        setActiveMemberId((prev) => {
          if (prev && data.some((m) => String(m.id) === String(prev))) {
            return prev;
          }
          return data[0]?.id ? String(data[0].id) : "";
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
    // Poll every 4 seconds so incoming attendee messages update automatically in real-time
    const interval = setInterval(fetchMembers, 4000);
    return () => clearInterval(interval);
  }, [fetchMembers]);

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
      id: `msg-${Date.now()}`,
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

    // Call Backend API
    const sent = await messageTeamService.sendMessage(activeMemberId, textToSend);
    if (sent) {
      // Re-fetch to synchronize state
      fetchMembers();
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
  };
}
