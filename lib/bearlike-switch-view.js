"use babel";

import { CompositeDisposable } from "event-kit";

export class BearlikeSwitchView {
  subscriptions = new CompositeDisposable();
  last_column_view = -1;
  last_column_cmd = -1;
  editor_header_top_spacer = null;
  editor_meta_layout = null;
  /*
   *
   */
  activate() {
    // add commands
    this.subscriptions.add(
      inkdrop.commands.add(document.body, {
        "bearlike-switch-view:toggle-one": () => this.invokeOne(),
        "bearlike-switch-view:toggle-two": () => this.invokeTwo(),
        "bearlike-switch-view:toggle-three": () => this.invokeThree(),
      })
    );
    // initialize
    if (inkdrop.isEditorActive()) {
      this.initialize();
    } else {
      inkdrop.onEditorLoad(() => this.initialize());
    }
  }
  /*
   *
   */
  deactivate() {
    this.subscriptions.dispose();
  }
  /*
   *
   */
  initialize() {
    const isVisible = this.isSideBarVisibleState();
    this.last_column_view = isVisible ? 3 : 2;
    this.last_column_cmd = this.last_column_view;

    this.editor_header_top_spacer = this.query(".editor-header-top-spacer");
    this.editor_meta_layout = this.query(".editor-meta-layout");
  }
  /*
   *
   */
  invokeOne() {
    if (this.last_column_cmd == 1) {
      this.toggle_column(this.last_column_view);
      this.last_column_cmd = this.last_column_view;
      this.last_column_view = 1;
    } else {
      this.last_column_view = this.last_column_cmd;
      this.last_column_cmd = 1;
      this.toggle_column(this.last_column_cmd);
    }
  }
  /*
   *
   */
  invokeTwo() {
    if (this.last_column_cmd == 2) {
      this.toggle_column(this.last_column_view);
      if (this.last_column_cmd != this.last_column_view) {
        this.last_column_cmd = this.last_column_view;
        this.last_column_view = 2;
      }
    } else {
      this.last_column_view = this.last_column_cmd;
      this.last_column_cmd = 2;
      this.toggle_column(this.last_column_cmd);
    }
  }
  /*
   *
   */
  invokeThree() {
    if (this.last_column_cmd == 3) {
      this.toggle_column(this.last_column_view);
      this.last_column_cmd = this.last_column_view;
      this.last_column_view = 3;
    } else {
      this.last_column_view = this.last_column_cmd;
      this.last_column_cmd = 3;
      this.toggle_column(this.last_column_cmd);
    }
  }
  /*
   *
   */
  toggle_column(col) {
    switch (col) {
      case 1:
        this.toggle_column_one();
        break;
      case 2:
        this.toggle_column_two();
        break;
      case 3:
        this.toggle_column_three();
        break;
    }
  }
  /*
   *
   */
  toggle_column_one() {
    if (this.findNoteList() == null) {
      return;
    }
    this.invoke("view:toggle-distraction-free");
    // this.editor_header_top_spacer.style.height = "16px";
    // this.editor_meta_layout.style.display = "none";
  }
  /*
   *
   */
  toggle_column_two() {
    // this.editor_header_top_spacer.style.height = "0px";
    // this.editor_meta_layout.style.display = "";
    // sidebar が出ている場合は非表示
    if (this.findSideBar() != null) {
      this.invoke("view:toggle-sidebar");
      return;
    }
    // note-list が出ている場合は何もしない
    if (this.findNoteList() != null) {
      return;
    }

    // distraction-free になっている場合
    if (this.isSideBarVisibleState()) {
      // sidebar が表示設定になっている場合
      this.invoke("view:toggle-distraction-free");
      this.invoke("view:toggle-sidebar");
      return;
    }

    // sidebar が非表示設定になっている場合
    this.invoke("view:toggle-distraction-free");
  }
  /*
   *
   */
  toggle_column_three() {
    // this.editor_header_top_spacer.style.height = "0px";
    // this.editor_meta_layout.style.display = "";

    // sidebar が表示されている場合
    if (this.findSideBar() != null) {
      return;
    }
    // note-list が表示されているが sidebar が無い場合
    if (this.findNoteList() != null) {
      this.invoke("view:toggle-sidebar");
      return;
    }

    // distraction-free になっている場合

    // sidebar が表示設定になっている場合
    if (this.isSideBarVisibleState()) {
      this.invoke("view:toggle-distraction-free");
      return;
    }
    // sidebar が非表示設定になっている場合
    this.invoke("view:toggle-distraction-free");
    this.invoke("view:toggle-sidebar");
  }
  /*
   *
   */
  findSideBar() {
    return this.query("#app-container  .main-layout .sidebar-layout");
  }
  /*
   *
   */
  findNoteList() {
    return this.query("#app-container .main-layout .note-list-bar-layout");
  }
  /*
   *
   */
  invoke(command, param) {
    inkdrop.commands.dispatch(document.body, command, param);
  }
  /*
   *
   */
  query(selectors) {
    return document.querySelector(selectors);
  }
  /*
   *
   */
  isSideBarVisibleState() {
    const value = inkdrop.config.get(
      "core.lastNavigationState.sidebar.workspace.visible"
    );
    if (value != undefined) {
      return value;
    }
    return inkdrop.config.get("core.mainWindow.sideBar.visible");
  }
}
