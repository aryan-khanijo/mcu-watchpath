import { getDb } from "@/db";
import { titles } from "@/db/schema";
import { eq } from "drizzle-orm";
import TitleForm from "../../TitleForm";
import { notFound } from "next/navigation";

export default async function EditTitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  
  const existingTitle = await db.query.titles.findFirst({
    where: eq(titles.id, parseInt(id, 10)),
  });

  if (!existingTitle) {
    notFound();
  }

  return (
    <div className="app-container admin">
      <header className="header" style={{ marginBottom: 24 }}>
        <div className="header-logo">
          <div className="header-title">
            Edit <span>Title</span>
          </div>
        </div>
        <a href="/admin/titles" className="btn btn-small btn-secondary">
          Cancel
        </a>
      </header>

      <div className="card">
        <TitleForm initialData={existingTitle} />
      </div>
    </div>
  );
}
