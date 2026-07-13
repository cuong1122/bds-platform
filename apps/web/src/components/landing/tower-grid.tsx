"use client";

import { useBuildings } from "@/features/listing/hooks";

export function TowerGrid() {
  const { data: buildings, isLoading, error } = useBuildings();

  return (
    <section className="bg-ink text-white/80 py-24" id="toa-thap">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="max-w-xl mx-auto text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4 font-mono text-xs tracking-[0.18em] uppercase text-gold-light">
            <span className="w-8 h-px bg-gold-light" />
            Kiến Trúc
          </div>
          <h2 className="font-display font-medium text-4xl sm:text-5xl text-white mb-4">
            Các Tòa Tháp
          </h2>
          <p className="text-white/55 leading-relaxed">
            Mỗi tòa tháp mang một dấu ấn riêng, cùng kiến tạo nên một quần thể
            sống đẳng cấp.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="text-center text-white/40 py-16">Đang tải...</div>
      )}

      {error && (
        <div className="text-center text-red-400 py-16">
          Không thể tải dữ liệu tòa nhà. Vui lòng thử lại.
        </div>
      )}

      {buildings && buildings.length === 0 && (
        <div className="text-center text-white/40 py-16">
          Chưa có dữ liệu tòa nhà.
        </div>
      )}

      {buildings && buildings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {buildings.map((building, idx) => (
            <div
              key={building.id}
              className="relative h-[560px] overflow-hidden bg-ink flex items-end group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${
                    building.cover_image ||
                    "https://placehold.co/800x1000/2A2622/D9B876?text=" +
                      encodeURIComponent(building.name)
                  }')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="relative z-10 p-9 w-full">
                <div className="font-mono text-[11px] tracking-wider text-gold-light uppercase mb-2.5">
                  Tòa {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="font-display font-medium text-3xl text-white mb-2 italic">
                  {building.name}
                </div>
                <p className="text-sm text-white/60 max-w-[280px]">
                  {building.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
