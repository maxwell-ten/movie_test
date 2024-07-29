import { stringify } from 'qs'
import axios from 'axios'
import { IMDB_SEARCH_URL } from './movies.const'
import { IMDBMovie, Movie } from './movie.interfaces'
import { convertMovie, IMDBRequests } from './helper/imdb.helper'


const { searchMovie, getMovie } = IMDBRequests()
export const searchInIMDB = async (query: string): Promise<Partial<IMDBMovie>> => {
  const {data: {results}} = await searchMovie(query)
  const [movie] = results

  return movie
}

export const getMovieFromIMDB = async (IMDBId: string): Promise<Partial<Movie>> => {
  const { data } = await getMovie(IMDBId)
  return convertMovie(data)
}
