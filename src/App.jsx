import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import ProductSlider from './components/productlist';
import Vet from './components/vet';
import ArticlesSection from './components/interest';
import BrandsSection from './components/brend';
import Textinfo from './components/text';
import Footer from './components/footer';

const App = () => {
    return (
        <div>
            <Navbar/>
            <Hero/>
            <ProductSlider/>
            <Vet/>
            <ArticlesSection/>
            <BrandsSection/>
            <Textinfo/>
            <Footer/>
        </div>
    );
}

export default App;
