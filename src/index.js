import React from "react";
import { render } from "react-dom";
import { MarkdownEditor } from "./lib";

const App = () => <MarkdownEditor text="hello" height={700} />;

render(<App />, document.getElementById("root"));
