import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import 'keen-slider/keen-slider.min.css';
import KeenSlider from 'keen-slider'; 


const HotCollections = () => {



  const [nfts, setNfts] = useState([]);

  async function fetchNFTS() {
    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections",
      );

      console.log("API RESPONSE", data);

      setNfts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
      setNfts([]);
    }
  }

  useEffect(() => {
    fetchNFTS();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
   
  }, []);
  return (
    
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {nfts.slice(0,4).map((nft, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
              <div className="nft_coll">
                <div className="nft_wrap">
                  <Link to="/item-details">
                    <img src={nft.nftImage || nft.image || nftImage} className="lazy img-fluid" alt="" />
                  </Link>
                </div>
                <div className="nft_coll_pp">
                  <Link to="/author">
                    <img className="lazy pp-coll" src={nft.authorImage} alt="" />
                  </Link>
                  <i className="fa fa-check"></i>
                </div>
                <div className="nft_coll_info">
                  <Link to="/explore">
                    <h4>{nft.title || nft.name || "Untitled Collection"}</h4>
                  </Link>
                  <span>ERC-{nft.code}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
