import { App } from "./app.tsx";
import { render } from "ink";
import { createElement } from "react";

export async function runTui() {
  const instance = render(createElement(App));
  await instance.waitUntilExit();
}
