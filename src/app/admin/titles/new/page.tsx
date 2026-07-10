import TitleForm from "../TitleForm";

export default function NewTitlePage() {
  return (
    <div className="app-container admin">
      <header className="header" style={{ marginBottom: 24 }}>
        <div className="header-logo">
          <div className="header-title">
            Add <span>New Title</span>
          </div>
        </div>
        <a href="/admin/titles" className="btn btn-small btn-secondary">
          Cancel
        </a>
      </header>

      <div className="card">
        <TitleForm />
      </div>
    </div>
  );
}
