import React, { useEffect, useState } from 'react';
import EditiorNavbar from '../components/EditiorNavbar';
import Editor from '@monaco-editor/react';
import { AiOutlineExpandAlt } from "react-icons/ai";
import { FaPlay, FaStop } from "react-icons/fa";
import { api_base_url } from '../helper';
import { useParams } from 'react-router-dom';

const Editior = () => {
  // Theme context removed; using static editor theme
  const [tab, setTab] = useState("html");
  const [isExpanded, setIsExpanded] = useState(false);
  const [htmlCode, setHtmlCode] = useState("<h1>Hello world</h1>");
  const [cssCode, setCssCode] = useState("body { background-color: #f4f4f4; }");
  const [jsCode, setJsCode] = useState("// some comment");
  const [code, setCode] = useState(""); // For single file languages
  const [projectData, setProjectData] = useState(null);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  // Extract projectID from URL using useParams
  const { projectID } = useParams();

  // Language configurations
  const languageConfigs = {
    web: { 
      name: "Web Development", 
      icon: "🌐",
      hasMultipleFiles: true,
      tabs: ["html", "css", "js"]
    },
    python: { 
      name: "Python", 
      icon: "🐍",
      hasMultipleFiles: false,
      monacoLanguage: "python",
      fileExtension: ".py"
    },
    java: { 
      name: "Java", 
      icon: "☕",
      hasMultipleFiles: false,
      monacoLanguage: "java",
      fileExtension: ".java"
    },
    cpp: { 
      name: "C++", 
      icon: "⚡",
      hasMultipleFiles: false,
      monacoLanguage: "cpp",
      fileExtension: ".cpp"
    },
    c: { 
      name: "C", 
      icon: "🔧",
      hasMultipleFiles: false,
      monacoLanguage: "c",
      fileExtension: ".c"
    },
    nodejs: { 
      name: "Node.js", 
      icon: "🟢",
      hasMultipleFiles: false,
      monacoLanguage: "javascript",
      fileExtension: ".js"
    },
    typescript: { 
      name: "TypeScript", 
      icon: "🔷",
      hasMultipleFiles: false,
      monacoLanguage: "typescript",
      fileExtension: ".ts"
    }
  };



  const run = () => {
    if (projectData?.language === 'web') {
      const html = htmlCode;
      const css = `<style>${cssCode}</style>`;
      const js = `<script>${jsCode}</script>`;
      const iframe = document.getElementById("iframe");

      if (iframe) {
        iframe.srcdoc = html + css + js;
      }
    }
  };

  const executeCode = async () => {
    if (!projectData || projectData.language === 'web') {
      run();
      return;
    }

    setIsExecuting(true);
    setOutput("Executing code...");

    try {
      const response = await fetch(api_base_url + "/executeCode", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          projId: projectID,
          code: code,
          language: projectData.language,
          input: input
        })
      });

      const data = await response.json();
      if (data.success) {
        setOutput(data.output);
      } else {
        setOutput(`Error: ${data.error || data.message}`);
      }
    } catch (error) {
      setOutput(`Network Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const saveProject = async () => {
    const saveData = {
      userId: localStorage.getItem("userId"),
      projId: projectID,
      input: input
    };

    if (projectData?.language === 'web') {
      saveData.htmlCode = htmlCode;
      saveData.cssCode = cssCode;
      saveData.jsCode = jsCode;
    } else {
      saveData.code = code;
    }

    try {
      const response = await fetch(api_base_url + "/updateProject", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(saveData)
      });

      const data = await response.json();
      if (data.success) {
        alert("Project saved successfully");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Please try again.");
    }
  };

  useEffect(() => {
    if (projectData?.language === 'web') {
      setTimeout(() => {
        run();
      }, 200);
    }
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    fetch(api_base_url + "/getProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProjectData(data.project);
          setHtmlCode(data.project.htmlCode || "<h1>Hello world</h1>");
          setCssCode(data.project.cssCode || "body { background-color: #f4f4f4; }");
          setJsCode(data.project.jsCode || "// some comment");
          setCode(data.project.code || "");
          setOutput(data.project.output || "");
          setInput(data.project.input || "");
        }
      });
  }, [projectID]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveProject();
      }
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        executeCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [projectID, htmlCode, cssCode, jsCode, code, input]);

  if (!projectData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const currentLanguageConfig = languageConfigs[projectData.language] || languageConfigs.web;

  const downloadProject = () => {
    if (!projectData) return;
    if (projectData.language === 'web') {
      const html = `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>${projectData.title || 'project'}</title>\n<style>\n${cssCode}\n</style>\n</head>\n<body>\n${htmlCode}\n<script>\n${jsCode}\n</script>\n</body>\n</html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectData.title || 'project'}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      const ext = languageConfigs[projectData.language]?.fileExtension || '.txt';
      const content = code || '';
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectData.title || 'project'}${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
  <EditiorNavbar onDownload={downloadProject} title={projectData?.title} />
      <div className="flex h-screen">
        <div className={`left ${isExpanded ? "w-full" : "w-1/2"}`}>
          <div className="tabs flex items-center justify-between gap-2 w-full bg-[#1A1919] h-[50px] px-[40px]">
            <div className="tabs flex items-center gap-2">
              <div className="flex items-center gap-2 mr-4">
                <span className="text-lg">{currentLanguageConfig.icon}</span>
                <span className="text-sm text-gray-400">{currentLanguageConfig.name}</span>
              </div>
              
              {currentLanguageConfig.hasMultipleFiles ? (
                <>
                  <div onClick={() => setTab("html")} className={`tab cursor-pointer p-[6px] px-[10px] text-[15px] rounded ${tab === "html" ? "bg-[#00AEEF]" : "bg-[#1E1E1E]"}`}>HTML</div>
                  <div onClick={() => setTab("css")} className={`tab cursor-pointer p-[6px] px-[10px] text-[15px] rounded ${tab === "css" ? "bg-[#00AEEF]" : "bg-[#1E1E1E]"}`}>CSS</div>
                  <div onClick={() => setTab("js")} className={`tab cursor-pointer p-[6px] px-[10px] text-[15px] rounded ${tab === "js" ? "bg-[#00AEEF]" : "bg-[#1E1E1E]"}`}>JavaScript</div>
                </>
              ) : (
                <div className="tab p-[6px] bg-[#00AEEF] px-[10px] text-[15px] rounded">
                  main{currentLanguageConfig.fileExtension}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!currentLanguageConfig.hasMultipleFiles && (
                <button 
                  onClick={executeCode}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm disabled:opacity-50"
                >
                  {isExecuting ? <FaStop /> : <FaPlay />}
                  {isExecuting ? "Running..." : "Run"}
                </button>
              )}

              <i className="text-[20px] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}><AiOutlineExpandAlt /></i>
            </div>
          </div>

          {/* Editor Area */}
          <div className="editor-container">
            {currentLanguageConfig.hasMultipleFiles ? (
              // Web development with multiple files
              <>
                {tab === "html" && (
                  <Editor
                    onChange={(value) => {
                      setHtmlCode(value || "");
                      run();
                    }}
                    height="82vh"
                    theme="vs-dark"
                    language="html"
                    value={htmlCode}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                )}
                {tab === "css" && (
                  <Editor
                    onChange={(value) => {
                      setCssCode(value || "");
                      run();
                    }}
                    height="82vh"
                    theme="vs-dark"
                    language="css"
                    value={cssCode}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                )}
                {tab === "js" && (
                  <Editor
                    onChange={(value) => {
                      setJsCode(value || "");
                      run();
                    }}
                    height="82vh"
                    theme="vs-dark"
                    language="javascript"
                    value={jsCode}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                )}
              </>
            ) : (
              // Single file languages
              <Editor
                onChange={(value) => setCode(value || "")}
                height="82vh"
                theme="vs-dark"
                language={currentLanguageConfig.monacoLanguage}
                value={code}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            )}
          </div>
        </div>

        {/* Output/Preview Area */}
        {!isExpanded && (
          <div className="right w-1/2 flex flex-col">
            {currentLanguageConfig.hasMultipleFiles ? (
              <iframe
                id="iframe"
                className="flex-1 bg-white text-black"
                title="output"
              />
            ) : (
              <div className="flex flex-col h-full">
                {/* Input Area */}
                <div className="input-section bg-[#1A1919] p-4 border-b border-gray-600">
                  <h3 className="text-sm font-medium mb-2">Input:</h3>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-20 p-2 bg-[#2A2A2A] text-white rounded resize-none"
                    placeholder="Enter input for your program..."
                  />
                </div>

                {/* Output Area */}
                <div className="output-section flex-1 bg-[#0D0C0C] p-4 overflow-auto">
                  <h3 className="text-sm font-medium mb-2">Output:</h3>
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                    {output || "Run your code to see output..."}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Editior;
