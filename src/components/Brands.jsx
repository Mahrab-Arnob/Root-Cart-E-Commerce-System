import { assets } from "../assets/assets";
const Brands = () => {
  const brands = [
    assets.brand_1,
    assets.brand_2,
    assets.brand_3,
    assets.brand_4,
    assets.brand_5,
  ];
  return (
    <div className="py-12 ">
      <div className="flex flex-wrap items-center justify-center gap-5">
        {brands.map((brand, index) => (
          <img
            key={index}
            src={brand}
            alt="brand"
            className="w[200px] h[200px] object-contain"
          />
        ))}
      </div>
    </div>
  );
};
export default Brands;
