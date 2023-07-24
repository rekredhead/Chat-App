// DOMAIN/profile/username - someone's profile - immutable - viewer mode

export default function Page({ params }: { params: { username: string } }) {
   return <div>My Post: {params.username}</div>
}