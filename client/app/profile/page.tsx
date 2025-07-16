import React from 'react';
import { Mail, Pencil, MapPin, Calendar, Star, UserPlus } from 'lucide-react';

const user = {
  name: 'Alex Doe',
  username: 'alexdoe',
  avatarUrl: 'https://i.pravatar.cc/150?u=alexdoe',
  bio: "Software engineer specializing in frontend development. Passionate about creating intuitive user experiences and learning new technologies. Currently exploring the world of 3D rendering with Three.js. Let's connect and build something amazing together!",
  location: 'London, UK',
  joinedDate: 'Joined in June 2024',
  skillsToOffer: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Node.js', 'GraphQL'],
  skillsToLearn: ['Three.js', 'Python', 'Go', 'AWS'],
  reviews: [
    {
      author: 'Jane Smith',
      avatarUrl: 'https://i.pravatar.cc/150?u=janesmith',
      rating: 5,
      comment: 'Alex is a fantastic collaborator. Very knowledgeable in React and always willing to help.',
    },
    {
      author: 'Mike Johnson',
      avatarUrl: 'https://i.pravatar.cc/150?u=mikejohnson',
      rating: 5,
      comment: 'An amazing learning session on Next.js. I learned a lot. Highly recommended!',
    },
  ],
};

const ProfilePage = () => {
  return (
    <div className="bg-base-100 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user.avatarUrl} alt={`${user.name}'s avatar`} />
                </div>
              </div>
              <h1 className="card-title text-3xl font-bold mt-4">{user.name}</h1>
              <p className="text-base-content/70">@{user.username}</p>
              <div className="card-actions justify-center mt-4">
                <button className="btn btn-primary">
                  <Mail className="w-4 h-4" />
                  Message
                </button>
                <button className="btn btn-outline btn-primary">
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>
            <div className="card-body">
                <h2 className="card-title">Details</h2>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-base-content/70"/>
                        <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-base-content/70"/>
                        <span>{user.joinedDate}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: About, Skills, Reviews */}
        <div className="lg:col-span-2 space-y-8">
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl">About Me</h2>
                    <p>{user.bio}</p>
                </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Skills</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Skills to Offer</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skillsToOffer.map(skill => (
                                    <div key={skill} className="badge badge-primary badge-lg">{skill}</div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Skills to Learn</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skillsToLearn.map(skill => (
                                    <div key={skill} className="badge badge-secondary badge-lg">{skill}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl">Reviews ({user.reviews.length})</h2>
                    <div className="space-y-6 mt-4">
                        {user.reviews.map((review, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="avatar">
                                    <div className="w-12 h-12 rounded-full">
                                        <img src={review.avatarUrl} alt={`${review.author}'s avatar`} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold">{review.author}</h4>
                                        <div className="flex items-center">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                            {[...Array(5-review.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-base-content/30" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-base-content/80 mt-1">{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;