'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, Typography, Button } from '@mui/material';

export default function ProjectCard({ project }) {
  const router = useRouter();

  return (
    <Card sx={{ minWidth: 275, cursor: 'pointer' }} onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
      <CardContent>
        <Typography variant="h5" component="div">
          {project.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {project.description || 'No description'}
        </Typography>
        <Button size="small" variant="outlined">
          View Tasks
        </Button>
      </CardContent>
    </Card>
  );
}