import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function ProjectBreadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const project = useSelector((state) => state.project.project);

  if (!location.pathname.startsWith("/projects")) {
    return null;
  }

  const pathnames = location.pathname.split("/").filter(Boolean);

  const nameMap = {
    projects: "Projeler",
    "add-member": "Üye Ekle",
    "update-project": "Projeyi Güncelle",
  };

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{  ml: 3 }}>
      {pathnames.map((value, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");

        let label = nameMap[value] || value;

        if (value === projectId) {
          label = project?.name || "Proje Detayı";
        }

        const isLast = index === pathnames.length - 1;

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
