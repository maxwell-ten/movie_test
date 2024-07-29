import {
  CrewMember,
  GetCreditsResponse,
  GetVideosResponse,
  IMDBMovie,
  Movie,
  SearchMoviesResponse
} from '../movie.interfaces'
import { stringify } from 'qs'
import axios from 'axios'
import { IMDB_SEARCH_URL } from '../movies.const'
import { query } from 'express'

const findCrewMember = (crew: CrewMember[], memberJob: string) => crew.find(({ job }) => job === memberJob).name || ''
export const IMDBRequests = () => {
  const queryParams = stringify({
    language: 'ru',
    api_key: '01a467a34ee557cf6d34ccff95fda66b'
  })
  const MOVIE_URL = `${IMDB_SEARCH_URL}/movie`

  return {
    getMovie: (IMDBId: string) => axios.get<IMDBMovie>(`${MOVIE_URL}/${IMDBId}?${queryParams}`),
    getMovieCredits: (IMDBId: number) => axios.get<GetCreditsResponse>(`${MOVIE_URL}/${IMDBId}/credits?${queryParams}`),
    searchMovie: (query: string) =>
      axios.get<SearchMoviesResponse>(`${MOVIE_URL}/search/movie?${queryParams}&query=${query}`),
    getVideos: (IMDBId: number) => axios.get<GetVideosResponse>(`${MOVIE_URL}/${IMDBId}/videos?${queryParams}`)
  }
}

const { getMovieCredits, getVideos } = IMDBRequests()
export const MovieCredits = async (IMDBId: number) => {
  try {

    const { data: { crew, cast } } = await getMovieCredits(IMDBId)
    const actors = cast.map(({ name }) => name)
    return {
      actors,
      director: findCrewMember(crew, 'Director'),
      writer: findCrewMember(crew, 'Writer')
    }

  } catch (error) {
    console.log(error)
    return {
      actors: [],
      director: '',
      writer: ''
    }
  }
}

export const getTrailer = async (IMDBId: number) => {
  const {data: {results}} = await getVideos(IMDBId)
  const { key } = results.find(({type}) => type === 'Trailer')
  return `https://www.themoviedb.org/video/play?key=${key}`
}

export const convertMovie = async ({
                                     title,
                                     overview,
                                     release_date,
                                     id,
                                     poster_path,
                                     backdrop_path,
                                     revenue,
                                     runtime,
  vote_average,
  imdb_id,
  genres
                                   }: IMDBMovie): Promise<Partial<Movie>> => {
  const {
    actors,
    director,
    writer
  } = await MovieCredits(id)
  return ({
    title,
    plot: overview,
    year: String(new Date(release_date).getFullYear()),
    director,
    actors,
    poster: `https://image.tmdb.org/t/p/w600${poster_path}`,
    backdrop: `https://image.tmdb.org/t/p/w600${poster_path}`,
    trailer: await getTrailer(id),
    boxOffice: String(revenue),
    released: release_date,
    writer: 'Les Mayfield',
    runtime: String(runtime),
    ratingImdb: String(vote_average),
    imdbId: imdb_id,
    rated: '',
    genres: genres.map(({name}) => name)
  })
}