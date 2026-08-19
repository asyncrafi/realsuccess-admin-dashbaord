"use client";

import { useState, useMemo } from "react";
import { MOCK_TEAM_MEMBERS } from "../mock-data/message-team.data";
import { ChatChannelType, ChatMessage, TeamMember } from "../types/message-team.types";

export function useMessageTeam() {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [activeMemberId, setActiveMemberId] = useState<string>(MOCK_TEAM_MEMBERS[0].id);
  const [channelFilter, setChannelFilter] = useState<"all" | ChatChannelType>("all");
  const [contactSearch, setContactSearch] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  const activeMember = members.find((m) => m.id === activeMemberId) || members[0];

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.displayName.toLowerCase().includes(contactSearch.toLowerCase()) ||
        m.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
        m.lastMessage.toLowerCase().includes(contactSearch.toLowerCase());

      const matchesChannel =
        channelFilter === "all" || m.channelType === channelFilter;

      return matchesSearch && matchesChannel;
    });
  }, [members, contactSearch, channelFilter]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeMemberId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "admin",
      senderName: "RealSuccess Staff",
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSender: true,
    };

    setMembers((prevMembers) =>
      prevMembers.map((m) => {
        if (m.id === activeMemberId) {
          return {
            ...m,
            lastMessage: `Staff: ${newMsg.text}`,
            lastMessageTime: newMsg.timestamp,
            messages: [...m.messages, newMsg],
          };
        }
        return m;
      })
    );

    setInputMessage("");
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
  };
}
