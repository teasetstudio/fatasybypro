import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { useLocation } from 'react-router-dom';

interface Member {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user: {
    email: string;
  }
}

interface Project {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  organizationId: string;
  createdAt: string;
  organization: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  storyboard: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    projectId: string;
  };
}

interface Organization {
  id: string;
  name: string;
  description: string;
}

interface OrganizationContextType {
  organizations: Organization[];
  refreshOrganizations: () => Promise<void>;
  createOrganization: (name: string, description: string) => Promise<void>;
  updateOrganization: (name: string, description: string) => Promise<void>;
  deleteOrganization: (organizationId: string) => Promise<void>;
  selectedOrganization: Organization | null;
  setSelectedOrganization: (org: Organization | null) => void;

  projects: Project[];
  refreshProjects: () => Promise<void>;
  createProject: (name: string, description: string) => Promise<void>;
  getProject: (projectId: string) => Promise<Project | undefined>;
  deleteProject: (projectId: string) => Promise<void>;
  updateProject: (projectId: string, name: string, description: string) => Promise<Project | undefined>;

  members: Member[];
  refreshMembers: () => Promise<void>;
  addMember: (email: string, role: 'ADMIN' | 'MEMBER') => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganizationState] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const location = useLocation();

  // Wrapper function to handle both state and local storage
  const setSelectedOrganization = (org: Organization | null) => {
    setSelectedOrganizationState(org);
    if (org) {
      localStorage.setItem('lastSelectedOrganizationId', org.id);
    } else {
      localStorage.removeItem('lastSelectedOrganizationId');
    }
  };

  const refreshOrganizations = async () => {
    try {
      const response = await api.get('/organizations');
      const orgs = response.data;
      setOrganizations(orgs);
      
      // If no organization is selected and we have organizations
      if (!selectedOrganization && orgs.length > 0) {
        // Check local storage first
        const savedOrgId = localStorage.getItem('lastSelectedOrganizationId');
        if (savedOrgId) {
          const savedOrg = orgs.find((org: Organization) => org.id === savedOrgId);
          if (savedOrg) {
            setSelectedOrganization(savedOrg);
            return;
          }
        }
        // If no saved org or saved org not found, select the first one
        setSelectedOrganization(orgs[0]);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const createOrganization = async (name: string, description: string) => {
    try {
      const response = await api.post('/organizations', {
        name,
        description,
      });
      
      // Add the new organization to the organizations array
      const newOrganization: Organization = response.data;
      setOrganizations(prevOrganizations => [...prevOrganizations, newOrganization]);
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const updateOrganization = async (name: string, description: string) => {
    if (!selectedOrganization) return;

    try {
      const response = await api.put(`/organizations/${selectedOrganization.id}`, {
        name,
        description,
      });
      
      // Update the selected organization with new data
      setSelectedOrganizationState(prev => prev ? {
        ...prev,
        name: response.data.name,
        description: response.data.description,
      } : null);

      // Update the organization in the organizations array
      setOrganizations(prevOrgs => 
        prevOrgs.map(org => 
          org.id === selectedOrganization.id 
            ? { ...org, name: response.data.name, description: response.data.description }
            : org
        )
      );
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error; // Re-throw to handle in the component
    }
  };

  const deleteOrganization = async (organizationId: string) => {
    try {
      await api.delete(`/organizations/${organizationId}`);
      
      // Remove the organization from the organizations array
      setOrganizations(prevOrgs => prevOrgs.filter(org => org.id !== organizationId));
      
      // If the deleted organization was selected, clear the selection
      if (selectedOrganization?.id === organizationId) {
        setSelectedOrganization(null);
        setProjects([]);
        setMembers([]);
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error; // Re-throw to handle in the component
    }
  };

  const refreshProjects = async () => {
    if (!selectedOrganization) return;
    
    try {
      const response = await api.get(`/organizations/${selectedOrganization.id}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const refreshMembers = async () => {
    if (!selectedOrganization) return;
    
    try {
      const response = await api.get(`/organizations/${selectedOrganization.id}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const getProject = async (projectId: string): Promise<Project | undefined> => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    }
    return project;
  };

  const createProject = async (name: string, description: string) => {
    if (!selectedOrganization) return;

    try {
      const response = await api.post('/projects', {
        name,
        description,
        organizationId: selectedOrganization.id,
      });
      
      // Add the new project to the projects array
      const newProject: Project = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        organizationId: response.data.organizationId,
        ...response.data,
      };
      
      setProjects(prevProjects => [...prevProjects, newProject]);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await api.delete(`/projects/${projectId}`);
      // Remove the project from the projects array
      setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error; // Re-throw to handle in the component
    }
  };

  const updateProject = async (projectId: string, name: string, description: string): Promise<Project | undefined> => {
    try {
      const response = await api.put(`/projects/${projectId}`, {
        name,
        description,
      });

      let updatedProject = response.data;
      
      // Update the project in the projects array
      setProjects(prevProjects => 
        prevProjects.map(project => {
          updatedProject = { ...updatedProject, name: response.data.name, description: response.data.description };
          return project.id === projectId ? updatedProject : project;
        })
      );

      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      // throw error; // Re-throw to handle in the component
      return Promise.reject(error)
    }
  };

  const addMember = async (email: string, role: 'ADMIN' | 'MEMBER') => {
    if (!selectedOrganization) return;

    try {
      await api.post(`/organizations/${selectedOrganization.id}/members`, {
        email,
        role,
      });
      await refreshMembers();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!selectedOrganization) return;

    try {
      await api.delete(`/organizations/${selectedOrganization.id}/members/${memberId}`);
      await refreshMembers();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  // Initial load of organizations
  useEffect(() => {
    refreshOrganizations();
  }, []); // Initial load

  // Refresh projects and members when organization changes
  // TODO: it is triggered when the organization is updated (new name, description)
  useEffect(() => {
    if (selectedOrganization) {
      refreshProjects();
      refreshMembers();
    } else {
      setProjects([]);
      setMembers([]);
    }
  }, [selectedOrganization]); // Refresh projects and members when organization changes

  // Set selected organization based on URL
  useEffect(() => {
    const match = location.pathname.match(/^\/organizations\/([^/]+)/);
    if (match && organizations.length > 0) {
      const orgId = match[1];
      const org = organizations.find(o => o.id === orgId);
      if (org) {
        setSelectedOrganization(org);
      } else {
        setSelectedOrganization(null);
      }
    }
  }, [location.pathname, organizations]);

  const value = {
    organizations,
    selectedOrganization,
    setSelectedOrganization,
    refreshOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    projects,
    refreshProjects,
    createProject,
    getProject,
    deleteProject,
    updateProject,
    members,
    refreshMembers,
    addMember,
    removeMember,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}; 