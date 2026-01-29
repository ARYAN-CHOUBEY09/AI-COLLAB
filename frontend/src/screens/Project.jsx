import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";
import { getWebContainer } from "../config/webcontainer";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const location = useLocation();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const messageBox = useRef(null);

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [fileTree, setFileTree] = useState({});

  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [runProcess, setRunProcess] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  };

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then(() => setIsModalOpen(false))
      .catch(console.log);
  }

  const send = () => {
    if (!message.trim()) return;

    sendMessage("project-message", {
      message,
      sender: user,
    });

    setMessage("");
  };

  function WriteAiMessage(message) {
    let messageObject = null;

    try {
      messageObject = JSON.parse(message);
    } catch {
      return (
        <div className="bg-[#0d1117] text-white rounded-sm p-2">
          <Markdown
            children={message}
            options={{
              overrides: { code: SyntaxHighlightedCode },
            }}
          />
        </div>
      );
    }

    return (
      <div className="overflow-auto bg-[#0d1117] text-white rounded-sm p-2">
        <Markdown
          children={messageObject.text}
          options={{
            overrides: { code: SyntaxHighlightedCode },
          }}
        />
      </div>
    );
  }

  useEffect(() => {
    initializeSocket(project._id);

    if (!webContainer) {
      getWebContainer().then((container) => setWebContainer(container));
    }

    receiveMessage("project-message", (data) => {
      if (data?.sender?._id === "ai") {
        try {
          const parsed = JSON.parse(data.message);
          if (parsed.fileTree) {
            webContainer?.mount(parsed.fileTree);
            setFileTree(parsed.fileTree);
          }
        } catch {}
      }

      setMessages((prev) => [...prev, data]);
    });

    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        setProject(res.data.project);
        setFileTree(res.data.project.fileTree || {});
      });

    axios
      .get("/users/all")
      .then((res) => setUsers(res.data.users))
      .catch(console.log);
  }, []);

  function saveFileTree(ft) {
    axios
      .put("/projects/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      })
      .catch(console.log);
  }

  return (
    <main className="min-h-screen w-screen flex bg-[#0f1117] text-white pt-16">
      {/* LEFT CHAT SECTION */}
      <section className="left relative flex flex-col  min-w-96 bg-[#111827] border-r border-white/10">
        {/* HEADER */}
        <header className="flex justify-between items-center px-4 py-3 bg-[#1f2937] border-b border-white/10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-sm px-3 py-1 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-md"
          >
            <i className="ri-add-line"></i> Add Collaborator
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2 hover:bg-white/10 rounded-md"
          >
            <i className="ri-group-fill text-lg"></i>
          </button>
        </header>

        {/* CHAT */}
        <div className="conversation-area pt-4 pb-20 flex-grow flex flex-col h-full relative">
          <div
            ref={messageBox}
            className="message-box flex-grow flex flex-col gap-3 overflow-auto px-3"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl max-w-[75%] text-sm 
                                ${
                                  msg?.sender?._id === user?._id
                                    ? "ml-auto bg-blue-600/20 border border-blue-500/40"
                                    : msg?.sender?._id === "ai"
                                      ? "bg-gray-900 border border-white/10"
                                      : "bg-white/10 border border-white/10"
                                }`}
              >
                <small className="text-xs opacity-60">
                  {msg?.sender?.email || "Unknown"}
                </small>

                <div className="mt-1">
                  {msg?.sender?._id === "ai" ? (
                    WriteAiMessage(msg.message)
                  ) : (
                    <p>{msg.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT FIELD */}
          <div className="absolute bottom-3 left-0 w-full px-3">
            <div className="flex items-center bg-[#1f2937] border border-white/10 rounded-lg overflow-hidden">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    send();
                  }
                }}
                className="flex-grow px-4 py-2 bg-transparent outline-none text-white"
                placeholder="Type a message..."
              />

              <button
                onClick={send}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                <i className="ri-send-plane-2-fill"></i>
              </button>
            </div>
          </div>
        </div>

        {/* COLLABORATOR DRAWER */}
        <div
          className={`sidePanel absolute top-0 h-full w-full bg-[#1f2937] 
                    border-r border-white/10 transition-all duration-300
                    ${isSidePanelOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <header className="flex justify-between items-center px-4 py-3 bg-[#111827] border-b border-white/10">
            <h1 className="font-semibold">Collaborators</h1>
            <button
              onClick={() => setIsSidePanelOpen(false)}
              className="p-2 hover:bg-white/10 rounded-md"
            >
              <i className="ri-close-fill text-xl"></i>
            </button>
          </header>

          <div className="p-3 flex flex-col gap-3">
            {project.users?.map((u) => (
              <div
                key={u._id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full">
                  <i className="ri-user-fill"></i>
                </div>
                <span>{u.email}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT MAIN SECTION */}
      <section className="right flex-grow flex bg-[#0f1117]">
        {/* EXPLORER */}
        <div className="explorer min-w-56 max-w-64 bg-[#111827] border-r border-white/10 h-full">
          <h2 className="px-4 py-3 font-semibold text-sm text-white/70 border-b border-white/10">
            Explorer
          </h2>

          <div className="file-tree">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(file);
                  setOpenFiles([...new Set([...openFiles, file])]);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10
                                ${currentFile === file ? "bg-white/10" : ""}`}
              >
                <i className="ri-file-code-line mr-2"></i> {file}
              </button>
            ))}
          </div>
        </div>

        {/* EDITOR */}
        <div className="code-editor flex flex-col flex-grow h-full">
          {/* TABS */}
          <div className="top flex items-center bg-[#1f2937] border-b border-white/10">
            {openFiles.map((file, index) => (
              <button
                key={index}
                onClick={() => setCurrentFile(file)}
                className={`px-4 py-2 text-sm border-r border-white/10
                                ${currentFile === file ? "bg-[#374151]" : "bg-[#1f2937]"}`}
              >
                {file}
              </button>
            ))}

            {/* RUN */}
            <button
              onClick={async () => {
                await webContainer.mount(fileTree);

                const installProcess = await webContainer.spawn("npm", [
                  "install",
                ]);
                installProcess.output.pipeTo(
                  new WritableStream({ write() {} }),
                );

                if (runProcess) runProcess.kill();

                let tempRunProcess = await webContainer.spawn("npm", ["start"]);
                tempRunProcess.output.pipeTo(
                  new WritableStream({ write() {} }),
                );

                setRunProcess(tempRunProcess);

                webContainer.on("server-ready", (port, url) =>
                  setIframeUrl(url),
                );
              }}
              className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm rounded-md m-2"
            >
              Run
            </button>
          </div>

          {/* CODE AREA */}
          <div className="bottom flex flex-grow h-full">
            {fileTree[currentFile] && (
              <div className="code-editor-area flex-grow bg-[#0d1117] overflow-auto p-4">
                <pre className="hljs">
                  <code
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      const ft = {
                        ...fileTree,
                        [currentFile]: { file: { contents: updatedContent } },
                      };
                      setFileTree(ft);
                      saveFileTree(ft);
                    }}
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlight(
                        "javascript",
                        fileTree[currentFile].file.contents,
                      ).value,
                    }}
                  />
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* PREVIEW */}
        {iframeUrl && (
          <div className="min-w-96 border-l border-white/10 flex flex-col bg-[#111827] h-full">
            <input
              type="text"
              value={iframeUrl}
              onChange={(e) => setIframeUrl(e.target.value)}
              className="p-2 bg-[#1f2937] border-b border-white/10 text-sm outline-none"
            />
            <iframe
              src={iframeUrl}
              className="w-full flex-grow bg-white"
            ></iframe>
          </div>
        )}
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1f2937] w-full max-w-md p-6 rounded-xl border border-white/10">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-md"
              >
                <i className="ri-close-fill text-2xl"></i>
              </button>
            </header>

            <div className="users-list flex flex-col gap-3 max-h-96 overflow-auto">
              {users
                .filter((u) => u._id !== user?._id) // optional: hide self
                .map((u) => (
                  <div
                    key={u._id}
                    onClick={() => handleUserClick(u._id)}
                    className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg
      ${
        selectedUserId.has(u._id)
          ? "bg-blue-600/30 border border-blue-500/30"
          : "bg-white/5 hover:bg-white/10"
      }`}
                  >
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <i className="ri-user-fill"></i>
                    </div>
                    <h1 className="text-lg">{u.email}</h1>
                  </div>
                ))}
            </div>

            <button
              onClick={addCollaborators}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-white font-medium"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
