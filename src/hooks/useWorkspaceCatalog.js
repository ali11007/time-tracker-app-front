import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trackerApi } from '../api/trackerApi';

export const useWorkspaceCatalog = () => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: trackerApi.listProjects,
    retry: false,
  });

  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: trackerApi.listTags,
    retry: false,
  });

  const invalidateCatalog = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['projects'] }),
      queryClient.invalidateQueries({ queryKey: ['tags'] }),
      queryClient.invalidateQueries({ queryKey: ['entries'] }),
    ]);
  };

  const createProjectMutation = useMutation({
    mutationFn: trackerApi.createProject,
    onSuccess: invalidateCatalog,
  });

  const updateProjectMutation = useMutation({
    mutationFn: trackerApi.updateProject,
    onSuccess: invalidateCatalog,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: trackerApi.deleteProject,
    onSuccess: invalidateCatalog,
  });

  const createTagMutation = useMutation({
    mutationFn: trackerApi.createTag,
    onSuccess: invalidateCatalog,
  });

  const updateTagMutation = useMutation({
    mutationFn: trackerApi.updateTag,
    onSuccess: invalidateCatalog,
  });

  const deleteTagMutation = useMutation({
    mutationFn: trackerApi.deleteTag,
    onSuccess: invalidateCatalog,
  });

  return {
    projects: projectsQuery.data ?? [],
    tags: tagsQuery.data ?? [],
    isLoadingProjects: projectsQuery.isLoading,
    isLoadingTags: tagsQuery.isLoading,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
    createTag: createTagMutation.mutateAsync,
    updateTag: updateTagMutation.mutateAsync,
    deleteTag: deleteTagMutation.mutateAsync,
    isCreatingProject: createProjectMutation.isPending,
    isUpdatingProject: updateProjectMutation.isPending,
    isDeletingProject: deleteProjectMutation.isPending,
    isCreatingTag: createTagMutation.isPending,
    isUpdatingTag: updateTagMutation.isPending,
    isDeletingTag: deleteTagMutation.isPending,
  };
};
