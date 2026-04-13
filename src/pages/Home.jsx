import React from 'react';
import Hero from '../components/hero';
import ProductSlider from '../components/productlist';
import Vet from '../components/vet';
import ArticlesSection from '../components/interest';
import BrandsSection from '../components/brend';
import Textinfo from '../components/text';

const Home = () => {
    return (
        <div>
            <Hero/>
            <ProductSlider/>
            <Vet/>
            <ArticlesSection/>
            <BrandsSection/>
            <Textinfo/>
        </div>
    );
};

export default Home;
