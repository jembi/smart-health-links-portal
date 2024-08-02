import Box from '@mui/material/Box';
import { Container, Typography } from "@mui/material";
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';

export default function Home() {
  return (
    <Container maxWidth={false}> 
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        paddingTop={8}
        paddingBottom={8}
      >
        <MonitorHeartOutlinedIcon sx={{fontSize: 200}} />
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to Smart Health Links Portal!
        </Typography>
        <Typography variant="body1" align="center">   
          Share you medical data with confidence
        </Typography>
      </Box>
    </Container>
  );
}
