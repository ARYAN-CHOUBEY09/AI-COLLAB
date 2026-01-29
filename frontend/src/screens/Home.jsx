
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  /* FETCH PROJECTS */
  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects/all");
      setProjects(Array.isArray(res.data.projects) ? res.data.projects : []);
    } catch (err) {
      console.error("Failed to fetch projects", err);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* CREATE PROJECT */
  const createProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      await axios.post("/projects/create", {
        name: projectName.trim(),
      });

      setProjectName("");
      setIsModalOpen(false);
      fetchProjects(); // reload
    } catch (err) {
      console.error("Project creation failed", err);
    }
  };

  /* AUTH GUARD */
  if (!user) return <div className="p-4 text-white">Loading...</div>;

  return (
    <main className="min-h-screen p-6 bg-[#0f1117] text-white">

      <h1 className="text-3xl font-extrabold mb-9 pt-9
        bg-gradient-to-r from-blue-400 to-blue-200 
        bg-clip-text text-transparent mt-10">
        Your Projects
      </h1>

      <div className="projects flex flex-wrap gap-5">

        {/* NEW PROJECT BUTTON */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-6 rounded-xl min-w-60 bg-white/5 border border-white/10 
                     hover:bg-white/10 hover:scale-[1.02] transition-all 
                     shadow-lg shadow-black/40 flex flex-col items-center justify-center gap-2"
        >
          <i className="ri-add-circle-line text-4xl text-blue-300"></i>
          <p className="text-lg font-semibold">Create New Project</p>
        </button>

        {/* PROJECT CARDS */}
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() =>
              navigate("/project", { state: { project } })
            }
            className="p-6 rounded-xl min-w-60 bg-white/5 border border-white/10 
                       hover:bg-white/10 hover:scale-[1.02] transition-all cursor-pointer 
                       shadow-lg shadow-black/40 flex flex-col gap-3"
          >
            <h2 className="font-bold text-xl text-blue-300">
              {project?.name || "Untitled Project"}
            </h2>

            <div className="flex items-center gap-2 text-gray-300">
              <i className="ri-group-line text-lg"></i>
              {project?.users?.length || 0} Collaborators
            </div>
          </div>
        ))}
      </div>

      {/* CREATE PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center 
                        bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1d27] p-6 rounded-xl border border-white/10 w-full max-w-md shadow-2xl">

            <h2 className="text-2xl font-bold mb-4 text-blue-300">
              Create New Project
            </h2>

            <form onSubmit={createProject}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full mt-2 p-3 rounded-lg bg-[#0f1117] border border-white/10
                             focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                             hover:bg-blue-700 transition"
                >
                  Create
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
