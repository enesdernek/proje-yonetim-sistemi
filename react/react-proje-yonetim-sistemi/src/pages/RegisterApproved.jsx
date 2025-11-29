import React from 'react';
import { Box, Typography } from '@mui/material';

function RegisterApproved() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh', 
        textAlign: 'center', 
        px: 2 
      }}
    >
      <Typography variant="h4" gutterBottom>
        Hesap Oluşturma Başarılı
      </Typography>
      <Typography variant="body1">
        Lütfen hesabınızı kullanmaya başlamak için mailinize gelen mesajdan hesabınızı onaylayınız.
      </Typography>
    </Box>
  );
}

export default RegisterApproved;
