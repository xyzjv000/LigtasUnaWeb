import React, { useState, useEffect, useContext } from 'react';
import Videos from './Common/Videos';
import Query from './Common/Query';
import axios from 'axios';
import { Context } from './../Store';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import PieChart from './Common/PieChart';
function Video() {
    useEffect(() => {
        getVideos();
    }, []);
    const [user] = useContext(Context);
    const [firstaid, setFirsaid] = useState([]);

    function getUnique(arr, comp) {
        // store the comparison  values in array
        const unique = arr
            .map((e) => e[comp])

            // store the indexes of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the false indexes & return unique objects
            .filter((e) => arr[e])
            .map((e) => arr[e]);

        return unique;
    }

    const getVideos = async () => {
        await axios.get(`${user.api_url}firstaid`).then((res) => {
            console.log(res.data);
            if (res.data.length > 0) {
                let dataArr = [];
                let counter = 0;
                let dataObj = {
                    category: [],
                    image: [],
                    video: {},
                };

                res.data.forEach((data) => {
                    counter++;
                    let imgArr = {};
                    if (dataObj.category.length < 1) {
                        dataObj.id = data.id;
                        dataObj.created = data.created;
                        dataObj.title = data.title;
                        dataObj.description = data.description;
                        dataObj.video.name = data.vidName;
                        dataObj.video.url = data.vidUrl;
                        dataObj.category.push(data.category);
                        imgArr.name = data.imgName;
                        imgArr.url = data.imgUrl;
                        dataObj.status = data.status;
                        dataObj.views = data.views;
                        dataObj.image.push(imgArr);
                    } else {
                        if (dataObj.id === data.id) {
                            dataObj.category.push(data.category);
                            imgArr.name = data.imgName;
                            imgArr.url = data.imgUrl;
                            dataObj.image.push(imgArr);
                        } else {
                            let xcat = [...new Set(dataObj.category)];
                            let ximg = getUnique(dataObj.image, 'url');
                            dataObj.category = xcat;
                            dataObj.image = ximg;
                            dataArr.push(dataObj);
                            dataObj = {
                                category: [],
                                image: [],
                                video: {},
                            };
                            //
                            dataObj.id = data.id;
                            dataObj.created = data.created;
                            dataObj.title = data.title;
                            dataObj.description = data.description;
                            dataObj.video.name = data.vidName;
                            dataObj.video.url = data.vidUrl;
                            dataObj.category.push(data.category);
                            imgArr.name = data.imgName;
                            imgArr.url = data.imgUrl;
                            dataObj.image.push(imgArr);
                            dataObj.status = data.status;
                            dataObj.views = data.views;
                        }
                    }

                    if (counter === res.data.length) {
                        let xcat = [...new Set(dataObj.category)];
                        let ximg = getUnique(dataObj.image, 'url');
                        dataObj.category = xcat;
                        dataObj.image = ximg;
                        dataArr.push(dataObj);
                        setFirsaid(dataArr);
                        console.log(firstaid);
                    }
                });
            }
        });
    };
    return (
        <div>
            <PieChart data={firstaid} />
            <div style={{ flexWrap: 'wrap', width: '90%', justifyContent: 'center', padding: '5px', margin: 'auto', display: 'flex' }}>
                {firstaid.map((fa, index) => {
                    return (
                        <Videos
                            faid={fa.id}
                            key={index}
                            cat={fa.category}
                            img={fa.image[0].url}
                            imgList={fa.image}
                            vid={fa.video}
                            title={fa.title}
                            description={fa.description}
                            created={fa.created}
                            status={fa.status}
                            views={fa.views}
                        />
                    );
                })}
                {firstaid.length < 1 ? (
                    <h1 style={{ marginTop: '200px', display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,.5)' }}>
                        <ErrorOutlineOutlinedIcon style={{ fontSize: '4rem' }} /> No Videos
                    </h1>
                ) : (
                    console.log('Exist')
                )}
            </div>
        </div>
    );
}

export default Video;
