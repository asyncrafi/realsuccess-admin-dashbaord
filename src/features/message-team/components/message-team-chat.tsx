"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Calendar,
  Paperclip,
  SendHorizontal,
  Users,
  MessageSquare,
} from "lucide-react";
import { useMessageTeam } from "../hooks/use-message-team";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function MessageTeamChat() {
  const {
    members,
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
  } = useMessageTeam();

  const [headerSearch, setHeaderSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const datePickerRef = useRef<HTMLDivElement>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat on new message
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMember.messages]);

  // Close Date Picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isDateFilterActive = Boolean(startDate || endDate);

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Message Team
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="w-56 md:w-64">
            <Input
              placeholder="Search..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              rightIcon={<Search className="h-4 w-4 text-gray-400" />}
              className="h-10 text-sm bg-white border-gray-200"
            />
          </div>


          {/* Date Range Filter Button & Popover */}
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={cn(
                "h-10 px-4 rounded-full border border-gray-200 bg-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer",
                isDateFilterActive
                  ? "border-[oklch(0.48_0.1394_252.75)] text-[oklch(0.48_0.1394_252.75)] bg-blue-50/50"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <span>
                {isDateFilterActive
                  ? `${startDate || "Start"} to ${endDate || "End"}`
                  : "Filter by date range"}
              </span>
              <Calendar className="h-4 w-4 text-gray-400" />
            </button>

            {/* Date Range Popover Dropdown */}
            {showDatePicker && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Select Chat History Date
                  </span>
                  {isDateFilterActive && (
                    <button
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                      }}
                      className="text-xs text-red-500 hover:underline font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="w-full h-9 text-xs rounded-full bg-[oklch(0.48_0.1394_252.75)] text-white font-semibold hover:bg-[oklch(0.40_0.1394_252.75)] transition-colors cursor-pointer"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Messaging Interface Container */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Conversations Panel (4 cols) */}
        <div className="lg:col-span-4 border-r border-gray-100 p-4 md:p-5 space-y-4 flex flex-col bg-gray-50/30">
          {/* Search Box */}
          <div className="relative">
            <Input
              placeholder="Search Message ..."
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              className="h-11 rounded-full text-xs bg-white border-gray-200 pl-10"
            />
          </div>

          {/* Channel Filter Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200 text-[11px] font-semibold">
            <button
              onClick={() => setChannelFilter("all")}
              className={cn(
                "flex-1 py-1.5 rounded-xl transition-colors cursor-pointer",
                channelFilter === "all"
                  ? "bg-[oklch(0.48_0.1394_252.75)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              All
            </button>
            <button
              onClick={() => setChannelFilter("event-group")}
              className={cn(
                "flex-1 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1",
                channelFilter === "event-group"
                  ? "bg-[oklch(0.48_0.1394_252.75)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Users className="h-3 w-3" />
              Event Group
            </button>
            <button
              onClick={() => setChannelFilter("direct-staff")}
              className={cn(
                "flex-1 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1",
                channelFilter === "direct-staff"
                  ? "bg-[oklch(0.48_0.1394_252.75)] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <MessageSquare className="h-3 w-3" />
              Direct Chat
            </button>
          </div>

          {/* Members Conversation List */}
          <div className="space-y-2 overflow-y-auto flex-1 max-h-[500px] pr-1">
            {members.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-medium">
                No chats found in this category.
              </div>
            ) : (
              members.map((member) => {
                const isActive = member.id === activeMemberId;
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setActiveMemberId(member.id)}
                    className={cn(
                      "w-full p-3.5 rounded-2xl transition-all duration-200 text-left flex items-start gap-3 cursor-pointer relative",
                      isActive
                        ? "bg-blue-50/80 border border-blue-100 shadow-2xs"
                        : "hover:bg-gray-100/70"
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative h-11 w-11 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image
                        src={member.avatar}
                        alt={member.displayName}
                        fill
                        className="object-cover"
                      />
                      {member.online && (
                        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-900 truncate">
                          {member.displayName}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {member.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate font-normal">
                        {member.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Chat Box (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between p-4 md:p-6 bg-white min-h-[600px]">
          {/* Active Chat Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden border border-gray-200">
                <Image
                  src={activeMember.avatar}
                  alt={activeMember.displayName}
                  fill
                  className="object-cover"
                />
                {activeMember.online && (
                  <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>
              <div className="space-y-0.5 text-left">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {activeMember.displayName}
                </h3>
                <p className="text-xs text-emerald-500 font-medium">
                  {activeMember.online ? "Online" : "Offline"} • {activeMember.eventName}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Stream Area */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4 max-h-[460px] px-2">
            {activeMember.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-lg space-y-1",
                  msg.isSender ? "ml-auto items-end text-right" : "items-start text-left"
                )}
              >
                {/* Sender Tag */}
                <span className="text-[10px] font-bold text-gray-400 px-1">
                  {msg.senderName}
                </span>

                {/* Message Bubble */}
                <div
                  className={cn(
                    "px-5 py-3.5 text-xs md:text-sm font-normal shadow-2xs leading-relaxed",
                    msg.isSender
                      ? "bg-[oklch(0.48_0.1394_252.75)] text-white rounded-[24px] rounded-tr-xs"
                      : "bg-white text-gray-800 border border-gray-200/90 rounded-[24px] rounded-tl-xs"
                  )}
                >
                  <p>{msg.text}</p>

                  <span
                    className={cn(
                      "block text-[10px] mt-1 font-medium",
                      msg.isSender ? "text-blue-100" : "text-gray-400"
                    )}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatMessagesEndRef} />
          </div>

          {/* Bottom Chat Message Input Bar */}
          <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <Paperclip className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Type a messages.."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-12 rounded-full border border-gray-300 bg-white pl-11 pr-4 text-xs md:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[oklch(0.48_0.1394_252.75)]"
              />
            </div>

            <button
              type="button"
              onClick={handleSendMessage}
              className="h-12 w-12 rounded-full bg-[oklch(0.48_0.1394_252.75)] hover:bg-[oklch(0.40_0.1394_252.75)] text-white flex items-center justify-center shadow-md transition-colors cursor-pointer flex-shrink-0"
              title="Send Message"
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
