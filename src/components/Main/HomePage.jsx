import Hero from "../hero";
import ProductSlider from "../productlist";
import Vet from "../vet";
import ArticlesSection from "../interest";
import BrandsSection from "../brend";
import Textinfo from "../text";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductSlider />
      <Vet />
      <ArticlesSection />
      <BrandsSection />
      <Textinfo />
    </>
  );
}
