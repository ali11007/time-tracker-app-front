import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trackerApi } from '../api/trackerApi';

export const useEntries = (filterText = '') => {
  const queryClient = useQueryClient();

  const entriesQuery = useQuery({
    queryKey: ['entries'],
    queryFn: trackerApi.listEntries,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: trackerApi.createEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entries'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: trackerApi.deleteEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entries'] }),
  });

  const updateMutation = useMutation({
    mutationFn: trackerApi.updateEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entries'] }),
  });

  const entries = entriesQuery.data ?? [];

  const filteredEntries = useMemo(() => {
    const normalized = filterText.trim().toLowerCase();
    if (!normalized) return entries;

    return entries.filter((entry) =>
      [entry.name, entry.project, (entry.tags ?? []).join(' '), entry.date]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [entries, filterText]);

  const totalTrackedSeconds = useMemo(
    () => filteredEntries.reduce((sum, entry) => sum + Number(entry.durationSeconds || 0), 0),
    [filteredEntries],
  );

  return {
    entries: filteredEntries,
    totalTrackedSeconds,
    isLoading: entriesQuery.isLoading,
    isError: entriesQuery.isError,
    error: entriesQuery.error,
    createEntry: createMutation.mutateAsync,
    updateEntry: updateMutation.mutateAsync,
    deleteEntry: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
