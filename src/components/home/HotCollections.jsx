import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import KeenSlider from 'keen-slider'; 
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Skeleton from '../UI/Skeleton';


const HotCollections = () => {

  const [nfts, setNfts] = useState([]);
  const [loading,setLoading] = useState(true);
  
  const [sliderRef, sliderInstance] = useKeenSlider({
    slides: {
      perView: 1,
      spacing: 10,
    },
    loop: true,
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 2,
          spacing: 15,
        },
      },
      "(min-width: 992px)": {
        slides: {
          perView: 4,
          spacing: 15,
        },
      },
    },
  });

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
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {
    fetchNFTS();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
   
  }, []);

  if (loading) {
    return (
      <section id="section-collections" className="no-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <Skeleton width="250px" height="40px" borderRadius="4px" />
                <div style={{ marginTop: "10px" }}>
                  <Skeleton width="80px" height="4px" borderRadius="2px" />
                </div>
              </div>
            </div>
            <div className="col-12" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "40px" }}>
              <div style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                <Skeleton width="40px" height="40px" borderRadius="50%" />
              </div>
              <div style={{ display: "flex", gap: "15px", flex: 1, minWidth: 0 }}>
                {new Array(4).fill(0).map((_, index) => (
                  <div key={index} style={{ flex: 1, minWidth: 0 }}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Skeleton width="100%" height="200px" borderRadius="8px" />
                      </div>
                      <div className="nft_coll_pp">
                        <Skeleton width="50px" height="50px" borderRadius="50%" />
                      </div>
                      <div className="nft_coll_info">
                        <Skeleton width="70%" height="20px" borderRadius="4px" />
                        <div style={{ marginTop: "8px" }}>
                          <Skeleton width="50%" height="14px" borderRadius="4px" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                <Skeleton width="40px" height="40px" borderRadius="50%" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return nfts.length > 0 ? (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {nfts.length > 0 && (
            <div className="col-12" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => sliderInstance.current?.prev()}
                className="slider-button prev-button"
              >
                <i className="fa fa-chevron-left"></i>
              </button>
              <div ref={sliderRef} className="keen-slider" style={{ flex: 1, minWidth: 0 }}>
                {nfts.map((nft, index) => (
                  <div
                    className="keen-slider__slide"
                    key={index}
                  >
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to="/item-details">
                          <img
                            src={nft.nftImage || nft.image || nftImage}
                            className="lazy img-fluid"
                            alt=""
                          />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to="/author">
                          <img
                            className="lazy pp-coll"
                            src={nft.authorImage}
                            alt=""
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>
                            {nft.title || nft.name || "Untitled Collection"}
                          </h4>
                        </Link>
                        <span>ERC-{nft.code}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => sliderInstance.current?.next()}
                className="slider-button next-button"
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  ) : (
    "NFT unavailable"
  );
};

export default HotCollections;
