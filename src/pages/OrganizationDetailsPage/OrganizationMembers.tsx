import React, { useState } from 'react';

interface Member {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user: {
    email: string;
  };
}

interface Props {
  members: Member[];
  organizationRole: 'OWNER' | 'ADMIN' | 'MEMBER';
  onAddMember: (email: string, role: 'ADMIN' | 'MEMBER') => void;
  onRemoveMember: (memberId: string) => void;
}

const OrganizationMembers: React.FC<Props> = ({ members, organizationRole, onAddMember, onRemoveMember }) => {
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');

  const handleAddMember = () => {
    onAddMember(newMemberEmail, newMemberRole);
    setShowMemberModal(false);
    setNewMemberEmail('');
    setNewMemberRole('MEMBER');
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowMemberModal(true)}
        >
          Add Member
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 border-b last:border-b-0"
          >
            <div>
              <p className="font-medium">{member.user.email}</p>
              <p className="text-sm text-gray-500">Role: {member.role}</p>
            </div>
            {organizationRole === 'OWNER' && member.role !== 'OWNER' && (
              <button
                className="text-red-500 hover:text-red-600"
                onClick={() => onRemoveMember(member.id)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter member's email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as 'ADMIN' | 'MEMBER')}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MEMBER">Member</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  onClick={() => setShowMemberModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  onClick={handleAddMember}
                  disabled={!newMemberEmail.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizationMembers; 