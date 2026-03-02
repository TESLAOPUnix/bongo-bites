import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';

export function useBlogs(page = 1) {
  return useQuery({
    queryKey: ['blogs', page],
    queryFn: () => blogService.getAll(page),
  });
}

export function useBlog(slug: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogService.getBySlug(slug),
    enabled: !!slug,
  });
}
