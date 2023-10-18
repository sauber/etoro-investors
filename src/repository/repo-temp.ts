import { RepoBackend } from "./mod.ts";
import { Files } from "./files.ts";
import { RepoDiskBackend } from "./repo-disk.ts";

export class RepoTempBackend extends RepoDiskBackend implements RepoBackend {
  constructor() {
    super("");
  }

  /** Create tmp dir if not already created */
  private _files: Files | null = null;
  protected async files(): Promise<Files> {
    if (!this._files) this._files = await Files.tmp();
    return this._files;
  }

  public delete(): Promise<void> {
    if (this._files) return this._files.delete();
    return new Promise((resolve)=>resolve());
  }
}