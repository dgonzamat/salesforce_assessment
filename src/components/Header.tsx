import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Dashboard as DashboardIcon,
  Description as ReportIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAssessment();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AssessmentIcon />
              Salesforce Assessment Tool
            </Typography>
            <Box sx={{ ml: 4, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 500,
                }}
              >
                Powered by
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  ml: 1,
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                NTT Data
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/')}
              sx={{
                backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              startIcon={<AssessmentIcon />}
              onClick={() => navigate('/assessment')}
              sx={{
                backgroundColor: isActive('/assessment') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Assessment
            </Button>
            <Button
              color="inherit"
              startIcon={<ReportIcon />}
              onClick={() => navigate('/report')}
              disabled={!state.currentAssessment}
              sx={{
                backgroundColor: isActive('/report') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                opacity: state.currentAssessment ? 1 : 0.5,
              }}
            >
              Report
            </Button>
            <Button
              color="inherit"
              startIcon={<SearchIcon />}
              onClick={() => navigate('/chile-discovery')}
              sx={{
                backgroundColor: isActive('/chile-discovery') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Chile Discovery
            </Button>
          </Box>

          {state.currentAssessment && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`${state.currentAssessment.clientName}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <Chip
                label={`Score: ${state.currentAssessment.overallScore}`}
                size="small"
                color="secondary"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 