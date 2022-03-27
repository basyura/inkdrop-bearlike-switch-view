"use babel";

import { BearlikeSwitchView } from "./bearlike-switch-view";

const plugin = new BearlikeSwitchView();

module.exports = {
  activate() {
    plugin.activate();
  },
  deactivate() {
    plugin.deactivate();
  },
};
