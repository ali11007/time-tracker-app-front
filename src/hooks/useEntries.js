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

  const invalidateEntries = () => queryClient.invalidateQueries({ queryKey: ['entries'] });

  const createMutation = useMutation({
    mutationFn: trackerApi.createManualEntry,
    onSuccess: invalidateEntries,
  });

  const startTimerMutation = useMutation({
    mutationFn: trackerApi.startTimer,
    onSuccess: invalidateEntries,
  });

  const stopTimerMutation = useMutation({
    mutationFn: trackerApi.stopTimer,
    onSuccess: invalidateEntries,
  });

  const deleteMutation = useMutation({
    mutationFn: trackerApi.deleteEntry,
    onSuccess: invalidateEntries,
  });

  const updateMutation = useMutation({
    mutationFn: trackerApi.updateEntry,
    onSuccess: invalidateEntries,
  });

  const entries = entriesQuery.data ?? [];
  const activeEntry = entries.find((entry) => entry.isActive) || null;

  const filteredEntries = useMemo(() => {
    const normalized = filterText.trim().toLowerCase();
    if (!normalized) return entries;

    return entries.filter((entry) =>
      [entry.name, entry.project, (entry.tags ?? []).join(' '), entry.date, entry.startAt, entry.endAt]
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
    activeEntry,
    totalTrackedSeconds,
    isLoading: entriesQuery.isLoading,
    isError: entriesQuery.isError,
    error: entriesQuery.error,
    createEntry: createMutation.mutateAsync,
    startTimer: startTimerMutation.mutateAsync,
    stopTimer: stopTimerMutation.mutateAsync,
    updateEntry: updateMutation.mutateAsync,
    deleteEntry: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isStartingTimer: startTimerMutation.isPending,
    isStoppingTimer: stopTimerMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
