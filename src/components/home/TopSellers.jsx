import React from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "../UI/Skeleton";

const TopSellers = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNFTS() {
    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers",
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

  if (loading) {
    return (
      <section id="section-popular" className="pb-5">
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
            <div className="col-md-12">
              <ol className="author_list">
                {new Array(12).fill(0).map((_, index) => (
                  <li key={index}>
                    <div className="author_list_pp">
                      <Skeleton width="50px" height="50px" borderRadius="50%" />
                    </div>
                    <div className="author_list_info">
                      <Skeleton
                        width="120px"
                        height="16px"
                        borderRadius="4px"
                      />
                      <div style={{ marginTop: "8px" }}>
                        <Skeleton
                          width="70px"
                          height="12px"
                          borderRadius="4px"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return nfts.length > 0 ? (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {nfts.length > 0 && (
            <div className="col-md-12">
              <ol className="author_list">
                {nfts.map((nft, index) => (
                  <li key={index}>
                    <div className="author_list_pp">
                      <Link to={`/author/${nft.authorId}`}>
                        <img
                          className="lazy pp-author"
                          src={nft.authorImage}
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    <div className="author_list_info">
                      <Link to={`/author/${nft.authorId}`}>
                        {nft.authorName}
                      </Link>
                      <span>{nft.price} ETH</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  ) : (
    "NFT UNAVAILABLE"
  );
};

export default TopSellers;
