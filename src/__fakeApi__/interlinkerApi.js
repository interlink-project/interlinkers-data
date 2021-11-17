import { addDays, subDays, subHours, subMinutes } from 'date-fns';

const now = new Date();

class InterlinkerApi {
  getInterlinkers() {
    const interlinkers = [
      {
        id: '5e8dcef8f95685ce21f16f3d',
        image:
          'https://simpatico.hi-iberia.es:4570/servicepedia/assets/logo_simpatico_small.png',
        team: {
          id: '5e887b7602bdbc4dbb234b27',
          name: 'Interlink Core Team Zaragoza',
          membersCount: 2,
        },
        description: `Citizenpedia is a Human-Computation enabling component which complements -government environments with a collaborative space
        where citizens and civil servants share and exploit accessible knowledge
        about public procedures, and more specifically, where citizens can solve
        their doubts and actively take part in the enhancement of e-services. To
        that end, Citizenpedia has been designed, as a participation (one of the key
        pillars of Open Government) fostering component comprised of three
        complementary tools, namely Question & Answer Engine (QAE), Collaborative Procedure Designer (CPD) and Servicepedia.`,
        currency: '$',
        isLiked: true,
        likes: 7,
        location: 'Spain',
        rating: 4,

        status: 'Engagement',
        title: 'Servicepedia',
        type: 'Example',
        updatedAt: subMinutes(now, 24).getTime(),
      },
      {
        id: '5e8dcef8f95685ce21f16f3F',
        title: 'OpenID',
        image:
          'https://img2.freepng.es/20180401/sdq/kisspng-openid-connect-authentication-oauth-identity-provi-id-5ac09ae9d954c2.0870859515225720098902.jpg',
        team: {
          id: '5e887b7602bdbc4dbb234b27',
          name: 'Example team',
          membersCount: 6,
        },
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum nisl est, non feugiat nulla vehicula et. Proin non justo justo. Sed rhoncus tempus posuere. In hac habitasse platea dictumst. Vivamus eu urna sed metus euismod varius vitae sed diam. Integer pharetra, odio vitae dignissim eleifend, est mauris molestie diam, eget fermentum lacus nulla eu metus. In risus libero, commodo vel feugiat sit amet, pretium sit amet velit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris consectetur aliquet ligula, id placerat lorem auctor ut. Suspendisse cursus in mauris eu varius. Fusce quis justo tincidunt, tempus diam non, vestibulum eros. Quisque volutpat, augue id pretium lobortis, tortor nisl ornare metus, at molestie elit diam vel arcu. Praesent aliquet posuere sapien, in facilisis orci accumsan quis. Mauris et lobortis elit. Proin tincidunt sed nunc at malesuada. Phasellus gravida mauris nec bibendum elementum. Fusce condimentum et magna eu ornare. Vestibulum porttitor, enim a tristique rutrum, odio arcu rutrum mi, et tempor tellus ipsum vel nibh. Ut faucibus vel diam nec faucibus. Pellentesque dictum orci risus, id pulvinar augue ultricies quis. Sed convallis fermentum lectus, ac consectetur sem consequat sit amet. Nunc vitae odio sed turpis rhoncus ornare.`,
        currency: '$',
        isLiked: true,
        likes: 7,
        location: 'Spain',
        rating: 4,

        status: 'Engagement',
        type: 'Example',
        updatedAt: subMinutes(now, 2404).getTime(),
      },
    ];

    return interlinkers;
  }

  getInterlinker() {
    const interlinker = {
      id: '5e8dcf076c50b9d8e756a5a2',
      activities: [
        {
          id: '5e8dd0828d628e6f40abdfe8',
          createdAt: subMinutes(now, 23).getTime(),
          description: 'has uploaded a new file',
          subject: 'Interlinker author',
          type: 'upload_file',
        },
        {
          id: '5e8dd0893a6725f2bb603617',
          createdAt: subHours(now, 2).getTime(),
          description: 'joined team as a Front-End Developer',
          subject: 'Adrian Stefan',
          type: 'join_team',
        },
        {
          id: '5e8dd08f44603e3300b75cf1',
          createdAt: subHours(now, 9).getTime(),
          description: 'joined team as a Full Stack Developer',
          subject: 'Alexndru Robert',
          type: 'join_team',
        },
        {
          id: '5e8dd0960f3f0fe04e64d8f4',
          createdAt: subDays(now, 2).getTime(),
          description: 'raised the interlinker budget',
          subject: 'Interlinker author',
          type: 'price_change',
        },
        {
          id: '5e8dd09db94421c502c53d13',
          createdAt: subDays(now, 4).getTime(),
          description: 'created',
          subject: 'Contest',
          type: 'contest_created',
        },
      ],
      applicants: [
        {
          id: '5e887a62195cc5aef7e8ca5d',
          avatar: '/static/mock-images/avatars/avatar-marcus_finn.png',
          commonConnections: 12,
          cover: '/static/mock-images/covers/cover_2.jpg',
          name: 'Marcus Finn',
          skills: [
            'User Experience',
            'FrontEnd development',
            'HTML5',
            'VueJS',
            'ReactJS',
          ],
        },
        {
          id: '5e887ac47eed253091be10cb',
          avatar: '/static/mock-images/avatars/avatar-carson_darrin.png',
          commonConnections: 5,
          cover: '/static/mock-images/covers/cover_3.jpg',
          name: 'Carson Darrin',
          skills: [
            'User Interface',
            'FullStack development',
            'Angular',
            'ExpressJS',
          ],
        },
        {
          id: '5e86809283e28b96d2d38537',
          avatar: '/static/mock-images/avatars/avatar-jane_rotanson.png',
          commonConnections: 17,
          cover: '/static/mock-images/covers/cover_1.jpg',
          name: 'Jane Rotanson',
          skills: ['BackEnd development', 'Firebase', 'MongoDB', 'ExpressJS'],
        },
      ],
      author: {
        id: '5e887d0b3d090c1b8f162003',
        name: 'Omar Darobe',
      },
      image:
          'https://simpatico.hi-iberia.es:4570/servicepedia/assets/logo_simpatico_small.png',
      budget: 12500.0,
      caption:
        "We're looking for experienced Developers and Product Designers to come aboard and help us build succesful businesses through software.",
      currency: '$',
      description: `Citizenpedia is a Human-Computation enabling component which complements -government environments with a collaborative space
        where citizens and civil servants share and exploit accessible knowledge
        about public procedures, and more specifically, where citizens can solve
        their doubts and actively take part in the enhancement of e-services. To
        that end, Citizenpedia has been designed, as a participation (one of the key
        pillars of Open Government) fostering component comprised of three
        complementary tools, namely Question & Answer Engine (QAE), Collaborative Procedure Designer (CPD) and Servicepedia.`,
      endDate: addDays(now, 14).getTime(),
      files: [
        {
          id: '5e8dd0721b9e0fab56d7238b',
          mimeType: 'image/png',
          name: 'example-interlinker1.jpg',
          size: 1024 * 1024 * 3,
          url: '/static/mock-images/interlinkers/interlinker_4.png',
        },
        {
          id: '5e8dd0784431995a30eb2586',
          mimeType: 'application/zip',
          name: 'docs.zip',
          size: 1024 * 1024 * 25,
          url: '#',
        },
        {
          id: '5e8dd07cbb62749296ecee1c',
          mimeType: 'image/png',
          name: 'example-interlinker2.jpg',
          size: 1024 * 1024 * 2,
          url: '/static/mock-images/interlinkers/interlinker_1.png',
        },
      ],
      isActive: true,
      isLiked: true,
      location: 'Europe',
      members: [
        {
          id: '5e887a62195cc5aef7e8ca5d',
          avatar: '/static/mock-images/avatars/avatar-marcus_finn.png',
          job: 'Front End Developer',
          name: 'Marcus Finn',
        },
        {
          id: '5e887ac47eed253091be10cb',
          avatar: '/static/mock-images/avatars/avatar-carson_darrin.png',
          job: 'UX Designer',
          name: 'Carson Darrin',
        },
        {
          id: '5e887b7602bdbc4dbb234b27',
          avatar: '/static/mock-images/avatars/avatar-jie_yan_song.png',
          job: 'Copyright',
          name: 'Jie Yan Song',
        },
      ],
      rating: 5,
      reviews: [
        {
          id: '5f0366cd843161f193ebadd4',
          author: {
            avatar: '/static/mock-images/avatars/avatar-marcus_finn.png',
            name: 'Marcus Finn',
          },
          comment: 'Great company, providing an awesome & easy to use product.',
          createdAt: subHours(now, 2).getTime(),
          value: 5,
        },
        {
          id: 'to33twsyjphcfj55y3t07261',
          author: {
            avatar: '/static/mock-images/avatars/avatar-miron_vitold.png',
            name: 'Miron Vitold',
          },
          comment:
            "Not the best people managers, poor management skills, poor career development programs. Communication from corporate & leadership isn't always clear and is sometime one-sided. Low pay compared to FANG.",
          createdAt: subHours(now, 2).getTime(),
          value: 2,
        },
        {
          id: '6z9dwxjzkqbmxuluxx2681jd',
          author: {
            avatar: '/static/mock-images/avatars/avatar-carson_darrin.png',
            name: 'Carson Darrin',
          },
          comment:
            'I have been working with this company full-time. Great for the work life balance. Cons, decentralized decision making process across the organization.',
          createdAt: subHours(now, 2).getTime(),
          value: 4,
        },
      ],
      startDate: addDays(now, 7).getTime(),
      keywords: ['Example'],
      title: 'ServicePedia',
      type: 'Full-Time',
      updatedAt: subMinutes(now, 23).getTime(),
    };

    return Promise.resolve(interlinker);
  }
}

export const interlinkerApi = new InterlinkerApi();
