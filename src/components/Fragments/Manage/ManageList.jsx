// src/components/Fragments/Manage/ManageList.jsx
import ItemCard from "./ManageItemCard";
import Pagination from "@/components/Elements/ManagePagination";
import LoadMore from "@/components/Elements/ManageLoadMore";

export default function ManageList({
  pageItems, isMobile, mobileItems, mobileCount,
  total, start, end, page, totalPages,
  onPrev, onNext, onMore,
  onEditItem, onDeleteItem, onChangeNom,
}) {
  const renderList = (list) => (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map((it) => (
        <ItemCard
          key={it.id}
          item={it}
          onEdit={() => onEditItem(it)}
          onDelete={() => onDeleteItem(it)}
          onChangeNom={(nom) => onChangeNom(it, nom)}
        />
      ))}
    </ul>
  );

  if (total === 0) return <p className="text-white/70">Belum ada data.</p>;

  return (
    <>
      {renderList(isMobile ? mobileItems : pageItems)}

      {isMobile ? (
        <LoadMore shown={mobileCount} total={total} onMore={onMore} />
      ) : (
        <Pagination
          page={page}
          totalPages={totalPages}
          start={start}
          end={end}
          total={total}
          onPrev={onPrev}
          onNext={onNext}
        />
      )}
    </>
  );
}
