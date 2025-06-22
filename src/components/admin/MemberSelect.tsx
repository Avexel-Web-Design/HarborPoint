import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  member_id: string;
  membership_type: string;
}

interface MemberSelectProps {
  selectedMembers: number[];
  onMembersChange: (memberIds: number[]) => void;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
}

const MemberSelect: React.FC<MemberSelectProps> = ({
  selectedMembers,
  onMembersChange,
  multiple = false,
  placeholder = "Search and select members...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState<Member[]>([]);

  // Load all members initially and when search term changes
  useEffect(() => {
    loadMembers();
  }, [searchTerm]);

  // Load selected member details when selectedMembers changes
  useEffect(() => {
    loadSelectedMemberDetails();
  }, [selectedMembers, members]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '50',
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/members?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedMemberDetails = () => {
    const details = selectedMembers
      .map(id => members.find(m => m.id === id))
      .filter(Boolean) as Member[];
    setSelectedMemberDetails(details);
  };

  const handleMemberSelect = (member: Member) => {
    if (multiple) {
      if (selectedMembers.includes(member.id)) {
        onMembersChange(selectedMembers.filter(id => id !== member.id));
      } else {
        onMembersChange([...selectedMembers, member.id]);
      }
    } else {
      onMembersChange([member.id]);
      setIsOpen(false);
    }
  };

  const handleRemoveMember = (memberId: number) => {
    onMembersChange(selectedMembers.filter(id => id !== memberId));
  };

  const clearSelection = () => {
    onMembersChange([]);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Members Display */}
      {selectedMemberDetails.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedMemberDetails.map(member => (
            <div
              key={member.id}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              <span>{member.first_name} {member.last_name}</span>
              <button
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {multiple && selectedMemberDetails.length > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500">Loading...</div>
          ) : members.length === 0 ? (
            <div className="p-3 text-center text-gray-500">No members found</div>
          ) : (
            <div className="py-1">
              {members.map(member => (
                <div
                  key={member.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                    selectedMembers.includes(member.id) ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                  onClick={() => handleMemberSelect(member)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {member.first_name} {member.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.email} • {member.member_id}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {member.membership_type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MemberSelect;
