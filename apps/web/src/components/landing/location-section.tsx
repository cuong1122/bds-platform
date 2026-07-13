import { MapView } from "./map-view";

export function LocationSection() {
  return (
    <section className="py-24 bg-cream-raised border-t border-black/10" id="vi-tri">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="max-w-xl mb-10">
          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] uppercase text-gold-dark font-semibold mb-4">
            <span className="w-8 h-px bg-gold" />
            Vị Trí
          </div>
          <h2 className="font-display font-medium text-ink text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
            Các Tòa Trên Bản Đồ
          </h2>
          <p className="text-slate leading-relaxed">
            Xem vị trí cụ thể của từng tòa để thuận tiện cho việc di chuyển
            tham quan.
          </p>
        </div>

        <MapView />
      </div>
    </section>
  );
}
