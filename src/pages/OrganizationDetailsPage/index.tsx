import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import OrganizationProjects from './OrganizationProjects';
import OrganizationMembers from './OrganizationMembers';
import OrganizationSettings from './OrganizationSettings';

interface Project {
  id: string;
  name: string;
  description: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

interface Member {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user: {
    email: string;
  }
}

interface Organization {
  id: string;
  name: string;
  description: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

const OrganizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrganization();
      fetchProjects();
      fetchMembers();
    }
  }, [id]);

  useEffect(() => {
    if (organization) {
      setEditName(organization.name);
      setEditDescription(organization.description);
    }
  }, [organization]);

  const fetchOrganization = async () => {
    try {
      const response = await api.get(`/organizations/${id}`);
      setOrganization(response.data);
    } catch (error) {
      console.error('Error fetching organization:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get(`/organizations/${id}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/organizations/${id}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleCreateProject = async (name: string, description: string) => {
    try {
      await api.post(`/projects`, {
        name,
        description,
        organizationId: id,
      });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleAddMember = async (email: string, role: 'ADMIN' | 'MEMBER') => {
    try {
      await api.post(`/organizations/${id}/members`, {
        email,
        role,
      });
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await api.delete(`/organizations/${id}/members/${memberId}`);
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleUpdateOrganization = async () => {
    if (!editName.trim()) return;
    setIsUpdating(true);
    try {
      await api.put(`/organizations/${id}`, {
        name: editName,
        description: editDescription,
      });
      fetchOrganization();
    } catch (error) {
      console.error('Error updating organization:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrganization = async () => {
    try {
      await api.delete(`/organizations/${id}`);
      navigate('/organizations');
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  if (!organization) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{organization.name}</h1>
      <p className="text-gray-600 mb-8">{organization.description}</p>

      <div className="border-b mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 ${
              activeTab === 0
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(0)}
          >
            Projects
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 1
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(1)}
          >
            Members
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 2
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(2)}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === 0 && (
        <OrganizationProjects
          projects={projects}
          onCreateProject={handleCreateProject}
        />
      )}

      {activeTab === 1 && (
        <OrganizationMembers
          members={members}
          organizationRole={organization.role}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      )}

      {activeTab === 2 && (
        <OrganizationSettings
          name={editName}
          description={editDescription}
          onNameChange={(value) => setEditName(value)}
          onDescriptionChange={(value) => setEditDescription(value)}
          onUpdate={handleUpdateOrganization}
          isUpdating={isUpdating}
          onDelete={handleDeleteOrganization}
          showDeleteConfirm={showDeleteConfirm}
          onShowDeleteConfirm={(show) => setShowDeleteConfirm(show)}
        />
      )}
    </div>
  );
};

export default OrganizationDetail; 