import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, Stack } from "@mui/material";

function NotAuthenticated() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          padding: 2,
          borderRadius: 4,
          boxShadow: 4,
          textAlign: "center",
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Uygulamayı Kullanmak İçin Giriş Yapınız
          </Typography>

          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/authenticate")}
              sx={{
                textTransform:"none"
              }}
            >
              Giriş Yap
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                textTransform:"none"
              }}
            >
              Hesap Oluştur
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NotAuthenticated;
