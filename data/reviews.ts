import type { Review } from '@/types'

export const reviews: Review[] = [
  {
    id: 'artem-l',
    author: 'Артём Л.',
    role: 'Владелец студии звукозаписи',
    company: 'Studio Rezonans',
    text: 'Впервые услышал свою комнату такой, какой она должна быть. Цифры в отчёте совпали с тем, что слышно ушами. Работали чётко, по расписанию, и предоставили полный отчёт с измерениями до и после.',
    rating: 5,
    projectId: 'rezonans-studio',
  },
  {
    id: 'marina-dmitry',
    author: 'Марина и Дмитрий',
    role: 'Частный кинотеатр',
    text: 'Сделали кинозал, который не гудит и не глушит. Чувствуется, что считали, а не угадывали. Теперь смотрим кино так, как задумывали режиссёры.',
    rating: 5,
    projectId: 'sochi-cinema',
  },
  {
    id: 'igor-v',
    author: 'Игорь В.',
    role: 'Hi-Fi аудиофил',
    company: 'Частный заказ',
    text: 'Скептически относился к акустическим панелям, думал это маркетинг. После обработки от ACOUSTIC SPACE — день и ночь. Стереосцена встала на место, бас перестал «гудеть» в углах.',
    rating: 5,
    projectId: 'spb-hifi',
  },
  {
    id: 'alexey-k',
    author: 'Алексей К.',
    role: 'Технический директор IT-компании',
    text: 'Переговорная комната была головной болью — из-за эха переговоры по видеосвязи были невыносимы. ACOUSTIC SPACE решили задачу за один визит замера и одну неделю монтажа.',
    rating: 5,
    projectId: 'moscow-office',
  },
]

export const videoReview = {
  id: 'video-1',
  title: 'Видеоотзыв · Студия Rezonans',
  duration: '2:14',
  thumbnail: '/images/reviews/video-thumb.jpg',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
}
