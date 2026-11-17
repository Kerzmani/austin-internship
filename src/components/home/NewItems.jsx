import React from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "../UI/Skeleton";
import KeenSlider from "keen-slider";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const NewItems = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});

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


  // Updates auction timers every second for each dynamic item using expiryDate and Date.now()
  function formatTimeLeft(expiryDate){
    const now = Date.now();
    const distance = expiryDate - now;

    if (distance <= 0) return "EXPIRED";

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  

  async function fetchNFTS() {
    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems",
      );

      console.log("NEW ITEMS API RESPONSE", data);

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
    if (!nfts.length) return;
    // guard clause: stops setting interval if nfts is empty
    const updateCountdowns = () => {
      // recalculates all NFT countdown strings
      const next = {};
      // new object that holds recalculated countdown strings from updateCountdowns()
      nfts.forEach((nft) => {
        next[nft.id] = formatTimeLeft(nft.expiryDate);
      })
      // Loops through each NFT fetched from API
      // uses NFT id as key and the coutndown string as the value
      setCountdowns(next);
      // updates countdowns with data stored in (next)
    };
    updateCountdowns();
    const timer = setInterval(updateCountdowns, 1000);
    // runs updateCountdowns every 1000ms (1s)

    return () => clearInterval(timer);
    // cleanup function - clears interval when effec is re-run or component unmounts
    // helps prevent memory leaks and duplicate intervals 
  }, [nfts]);
  // [nfts] is dependency array, effect runs whenever nfts changes
  // API sets nfts => useEffect starts interval for items 

  
// How they work
// formatTimeLeft hands a singular NFT
// updateCountdowns applies it to all NFTS and stores results in countdowns
// setInterval refreshes every 1000ms (1s)
// Cleanup allows only one active timer per current nfts set 


  //SKELETON LOADING STATE
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
            <div
              className="col-12"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "40px",
              }}
            >
              <div style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                <Skeleton width="40px" height="40px" borderRadius="50%" />
              </div>
              <div
                style={{ display: "flex", gap: "15px", flex: 1, minWidth: 0 }}
              >
                {new Array(4).fill(0).map((_, index) => (
                  <div key={index} style={{ flex: 1, minWidth: 0 }}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Skeleton
                          width="100%"
                          height="200px"
                          borderRadius="8px"
                        />
                      </div>
                      <div className="nft_coll_pp">
                        <Skeleton
                          width="50px"
                          height="50px"
                          borderRadius="50%"
                        />
                      </div>
                      <div className="nft_coll_info">
                        <Skeleton
                          width="70%"
                          height="20px"
                          borderRadius="4px"
                        />
                        <div style={{ marginTop: "8px" }}>
                          <Skeleton
                            width="50%"
                            height="14px"
                            borderRadius="4px"
                          />
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
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {nfts.length > 0 && (
            <div
              className="keen-slider"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <button
                onClick={() => {
                  if (sliderInstance.current?.track?.details)
                    sliderInstance.current.prev();
                }}
                className="slider-button prev-button"
              >
                <i className="fa fa-chevron-left"></i>
              </button>
              <div
                ref={sliderRef}
                className="keen-slider"
                style={{ flex: 1, minWidth: 0 }}
              >
                {nfts.map((nft, index) => (
                  <div
                    className="col-lg-3 col-md-6 col-sm-6 col-xs-12 keen-slider__slide"
                    key={index}
                  >
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <Link
                          to={`/author/${nft.authorId}`}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Creator: Monica Lucas"
                        >
                          <img className="lazy" src={nft.authorImage} alt="" />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="de_countdown">{countdowns[nft.id] || "Loading..."}</div>

                      <div className="nft__item_wrap">
                        <div className="nft__item_extra">
                          <div className="nft__item_buttons">
                            <button>Buy Now</button>
                            <div className="nft__item_share">
                              <h4>Share</h4>
                              <a href="" target="_blank" rel="noreferrer">
                                <i className="fa fa-facebook fa-lg"></i>
                              </a>
                              <a href="" target="_blank" rel="noreferrer">
                                <i className="fa fa-twitter fa-lg"></i>
                              </a>
                              <a href="">
                                <i className="fa fa-envelope fa-lg"></i>
                              </a>
                            </div>
                          </div>
                        </div>

                        <Link to="/item-details">
                          <img
                            src={nft.nftImage}
                            className="lazy nft__item_preview"
                            alt=""
                          />
                        </Link>
                      </div>
                      <div className="nft__item_info">
                        <Link to="/item-details">
                          <h4>{nft.title}</h4>
                        </Link>
                        <div className="nft__item_price">{nft.price} ETH</div>
                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i>
                          <span>{nft.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (sliderInstance.current?.track?.details)
                    sliderInstance.current.next();
                }}
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
    "NFT UNAVAILABLE"
  );
};

export default NewItems;
