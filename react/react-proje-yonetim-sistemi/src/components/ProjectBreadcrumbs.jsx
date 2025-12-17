import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function ProjectBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, assignedMemberId } = useParams();

  const project = useSelector((state) => state.project.project);

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
    "tasks": "Görevler",
  };

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ ml: 3 }}>
      {pathnames.map((value, index) => {

        // 🚫 assignedMemberId breadcrumb'ta gösterilmesin
        if (value === assignedMemberId) {
          return null;
        }

        const to = "/" + pathnames.slice(0, index + 1).join("/");

        let label = nameMap[value] || value;

        // projectId yerine proje adı göster
        if (value === projectId) {
          label = project?.name || "Proje Detayı";
        }

        // assignedMemberId varsa create-task son breadcrumb olsun
        const isLast =
          index === pathnames.length - 1 ||
          pathnames[index + 1] === assignedMemberId;

        return isLast ? (
          <Typography key={to} color="text.primary">
            {label}
          </Typography>
        ) : (
          <Link
            key={to}
            underline="hover"
            color="inherit"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(to)}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default ProjectBreadcrumbs;
