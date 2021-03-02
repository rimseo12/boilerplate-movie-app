import React, { useEffect, useState } from 'react'
import { API_KEY, API_URL, IMAGE_BASE_URL } from '../../Config'
import MainImage from '../LandingPage/Sections/MainImage'
import MovieInfo from './Sections/MovieInfo'
import GridCard from '../commons/GridCard'
import { Row } from 'antd'

function MovieDetail(props) {

    let movieId = props.match.params.movieId
    const [Movie, setMovie] = useState([])
    const [Casts, setCasts] = useState([])
    const [ActorToggle, setActorToggle] = useState(false)

    

    useEffect(() => {
        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`

        let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`

        fetch(endpointInfo)
            .then(res => res.json())
            .then(res => {
                setMovie(res)
            })

        fetch(endpointCrew)
            .then(res => res.json())
            .then(res => {
                setCasts(res.cast)
              
            })

    }, [])

    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    return (
        <div>
            {/* Header */}
            {Movie.backdrop_path && ( //Movie안의 backdrop_path를 가져오는데
                //시간이 오래걸릴 수도있기때문에 근데 가져오는 도중에 렌더링을 할려고하여 오류가발생한다.
                //이를 방지하기위한 코드(실제 콘솔에 이를안해주면 undefined라고 오류발생)
                <MainImage
                    image={`${IMAGE_BASE_URL}w1280/${Movie.backdrop_path}`} //영화이미지
                    title={Movie.original_title} //영화제목
                    text={Movie.overview} //영화에대한설명
                />
            )}

            {/* Body */}
            <div style={{ width: '80%', margin: '1rem auto' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                     <Favorite movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')} />
                </div>
                {/* Movie Info */}
                <MovieInfo
                    movie={Movie}
                />

                <br />

                {/* Actors Grid */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <button onClick={toggleActorView}>Toggle Actor View</button>
                </div>


                {ActorToggle && (
                    <Row gutter={[16, 16]}>
                        {Casts && 
                           Casts.map((cast, index) => (
                            <React.Fragment key={index}>
                                <GridCard
                                    image={
                                        cast.profile_path
                                            ? `${IMAGE_BASE_URL}w500/${cast.profile_path}`
                                            : null
                                    }
                                    characterName={cast.name}
                                />
                            </React.Fragment>
                        ))}
                    </Row>
                )}



            </div>
        </div>
    )
}

export default MovieDetail
