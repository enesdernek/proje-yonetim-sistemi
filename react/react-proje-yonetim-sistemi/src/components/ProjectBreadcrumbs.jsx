import {
  Breadcrumbs,
  Link,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function ProjectBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  const { projectId, memberId, userId } = useParams();

  const project = useSelector((state) => state.project.project);
  const projectMember = useSelector(
    (state) => state.projectMember.projectMember
  );

  if (!location.pathname.startsWith("/projects")) {
    return null;
  }

  const pathnames = location.pathname.split("/").filter(Boolean);

  const nameMap = {
    projects: "Projeler",
    "add-member": "Üye Ekle",
    "update-project": "Projeyi Güncelle",
    "manage-project": "Proje Durumunu Yönet",
    "create-project": "Proje Oluştur",
    "project-settings": "Proje Ayarları",
    "create-task": "Görev Oluştur",
    tasks: "Görevler",
    "my-tasks": "Görevlerim",
    "project-statistics":"Proje İstatistikleri"
  };

  const breadcrumbs = [];

  pathnames.forEach((value, index) => {
    const to = "/" + pathnames.slice(0, index + 1).join("/");

    if (value === userId) {
      return;
    }

    if (value === projectId) {
      breadcrumbs.push({
        label: project?.name || `Proje`,
        to,
      });
      return;
    }

    if (value === "my-tasks") {
      breadcrumbs.push({
        label: "Görevlerim",
        to: `/projects/${projectId}/my-tasks/${userId}`,
      });
      return;
    }

    if (value === memberId) {
      breadcrumbs.push({
        label: "Görevler",
        to: `/projects/${projectId}/tasks`,
      });

      breadcrumbs.push({
        label: projectMember?.userDto?.username || "Kullanıcı",
        to,
      });
      return;
    }

    breadcrumbs.push({
      label: nameMap[value] || value,
      to,
    });
  });

  

  return (
    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ mr: 1 }}
        size="small"
      >
        <ArrowBackIcon />
      </IconButton>

      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return isLast ? (
            <Typography key={crumb.to} color="text.primary">
              {crumb.label}
            </Typography>
          ) : (
            <Link
              key={crumb.to}
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(crumb.to)}
            >
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}

export default ProjectBreadcrumbs;
