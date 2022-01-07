import { addDays, subDays, subHours, subMinutes } from 'date-fns';

const now = new Date();

class InterlinkerApi {
  getInterlinkers() {
    return [
      {
        "name": "Skeleton to guide the description of the main aim of the collaborative project",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus sapien, dapibus fringilla dolor sit amet, bibendum aliquam massa. Duis nec faucibus nunc. In sit amet vulputate justo. In dictum turpis eu dolor posuere vehicula. Sed turpis risus, vestibulum sed aliquam id, tempus nec dolor. Nulla facilisi. Suspendisse tempor pulvinar dignissim. Nulla dui ante, finibus in bibendum vel, dignissim nec risus. Nullam gravida nisi quis purus porttitor, sed hendrerit ante tristique. Donec eget augue vitae purus vehicula vehicula non sit amet lacus. Quisque porta nisi pharetra, fringilla felis id, porta arcu. Mauris vel elementum tortor. Ut sed magna id enim finibus molestie eu vitae leo. Mauris at sem elit. Fusce viverra accumsan orci et feugiat. Mauris ullamcorper molestie massa ac faucibus. Integer sit amet tellus tortor. Vivamus bibendum at libero at aliquet. Proin consectetur, erat et vulputate tincidunt, tortor quam euismod elit, id efficitur sem sapien tempus dolor. Aliquam a molestie risus. Nunc rutrum rutrum felis, in malesuada dolor porttitor nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc condimentum porta magna sed pharetra. In non quam dolor.",
        "logotype": "/static/demodata/interlinkers/googledrive.png",
        "published": true,
        "keywords": [],
        "documentation": "<>string</>",
        "SOC_type": "A11",
        "nature": "KN",
        "administrative_scope": null,
        "specific_app_domain": null,
        "constraints": null,
        "regulations": null,
        "software_type": null,
        "software_implementation": null,
        "software_customization": null,
        "software_integration": null,
        "knowledge_type": null,
        "knowledge_format": null,
        "backend": "googledrive",
        "init_asset_id": "1FB30UvQBhEEjzbvMkPEOe3bH2_nLQO7B",
        "id": "534d0046-55ac-481e-b8a2-c5444aa479f3",
        "created_at": "2022-01-07T11:25:17.596266",
        "updated_at": null,
        "artefact_type": "interlinker",
        "problemdomains": [],
        "questioncomments": []
      },
      {
        "name": "Collaborative editor",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus sapien, dapibus fringilla dolor sit amet, bibendum aliquam massa. Duis nec faucibus nunc. In sit amet vulputate justo. In dictum turpis eu dolor posuere vehicula. Sed turpis risus, vestibulum sed aliquam id, tempus nec dolor. Nulla facilisi. Suspendisse tempor pulvinar dignissim. Nulla dui ante, finibus in bibendum vel, dignissim nec risus. Nullam gravida nisi quis purus porttitor, sed hendrerit ante tristique. Donec eget augue vitae purus vehicula vehicula non sit amet lacus. Quisque porta nisi pharetra, fringilla felis id, porta arcu. Mauris vel elementum tortor. Ut sed magna id enim finibus molestie eu vitae leo. Mauris at sem elit. Fusce viverra accumsan orci et feugiat. Mauris ullamcorper molestie massa ac faucibus. Integer sit amet tellus tortor. Vivamus bibendum at libero at aliquet. Proin consectetur, erat et vulputate tincidunt, tortor quam euismod elit, id efficitur sem sapien tempus dolor. Aliquam a molestie risus. Nunc rutrum rutrum felis, in malesuada dolor porttitor nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc condimentum porta magna sed pharetra. In non quam dolor.",
        "logotype": "/static/demodata/interlinkers/etherpad.jpeg",
        "published": true,
        "keywords": [],
        "documentation": "<>string</>",
        "SOC_type": "A11",
        "nature": "SW",
        "administrative_scope": null,
        "specific_app_domain": null,
        "constraints": null,
        "regulations": null,
        "software_type": null,
        "software_implementation": null,
        "software_customization": null,
        "software_integration": null,
        "knowledge_type": null,
        "knowledge_format": null,
        "backend": "etherwrapper",
        "init_asset_id": null,
        "id": "ec13aec8-f7e5-4c09-af18-684c3a5e545d",
        "created_at": "2022-01-07T11:25:21.338621",
        "updated_at": null,
        "artefact_type": "interlinker",
        "problemdomains": [],
        "questioncomments": []
      },
      {
        "name": "File manager",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus sapien, dapibus fringilla dolor sit amet, bibendum aliquam massa. Duis nec faucibus nunc. In sit amet vulputate justo. In dictum turpis eu dolor posuere vehicula. Sed turpis risus, vestibulum sed aliquam id, tempus nec dolor. Nulla facilisi. Suspendisse tempor pulvinar dignissim. Nulla dui ante, finibus in bibendum vel, dignissim nec risus. Nullam gravida nisi quis purus porttitor, sed hendrerit ante tristique. Donec eget augue vitae purus vehicula vehicula non sit amet lacus. Quisque porta nisi pharetra, fringilla felis id, porta arcu. Mauris vel elementum tortor. Ut sed magna id enim finibus molestie eu vitae leo. Mauris at sem elit. Fusce viverra accumsan orci et feugiat. Mauris ullamcorper molestie massa ac faucibus. Integer sit amet tellus tortor. Vivamus bibendum at libero at aliquet. Proin consectetur, erat et vulputate tincidunt, tortor quam euismod elit, id efficitur sem sapien tempus dolor. Aliquam a molestie risus. Nunc rutrum rutrum felis, in malesuada dolor porttitor nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc condimentum porta magna sed pharetra. In non quam dolor.",
        "logotype": "/static/demodata/interlinkers/filemanager.png",
        "published": true,
        "keywords": [],
        "documentation": "<>string</>",
        "SOC_type": "A11",
        "nature": "SW",
        "administrative_scope": null,
        "specific_app_domain": null,
        "constraints": null,
        "regulations": null,
        "software_type": null,
        "software_implementation": null,
        "software_customization": null,
        "software_integration": null,
        "knowledge_type": null,
        "knowledge_format": null,
        "backend": "filemanager",
        "init_asset_id": null,
        "id": "8964bbaa-2454-4255-b16c-b52acfb7cd84",
        "created_at": "2022-01-07T11:25:21.352579",
        "updated_at": null,
        "artefact_type": "interlinker",
        "problemdomains": [],
        "questioncomments": []
      },
      {
        "name": "Forum",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus sapien, dapibus fringilla dolor sit amet, bibendum aliquam massa. Duis nec faucibus nunc. In sit amet vulputate justo. In dictum turpis eu dolor posuere vehicula. Sed turpis risus, vestibulum sed aliquam id, tempus nec dolor. Nulla facilisi. Suspendisse tempor pulvinar dignissim. Nulla dui ante, finibus in bibendum vel, dignissim nec risus. Nullam gravida nisi quis purus porttitor, sed hendrerit ante tristique. Donec eget augue vitae purus vehicula vehicula non sit amet lacus. Quisque porta nisi pharetra, fringilla felis id, porta arcu. Mauris vel elementum tortor. Ut sed magna id enim finibus molestie eu vitae leo. Mauris at sem elit. Fusce viverra accumsan orci et feugiat. Mauris ullamcorper molestie massa ac faucibus. Integer sit amet tellus tortor. Vivamus bibendum at libero at aliquet. Proin consectetur, erat et vulputate tincidunt, tortor quam euismod elit, id efficitur sem sapien tempus dolor. Aliquam a molestie risus. Nunc rutrum rutrum felis, in malesuada dolor porttitor nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc condimentum porta magna sed pharetra. In non quam dolor.",
        "logotype": "/static/demodata/interlinkers/forum.png",
        "published": true,
        "keywords": [],
        "documentation": "<>string</>",
        "SOC_type": "A11",
        "nature": "SW",
        "administrative_scope": null,
        "specific_app_domain": null,
        "constraints": null,
        "regulations": null,
        "software_type": null,
        "software_implementation": null,
        "software_customization": null,
        "software_integration": null,
        "knowledge_type": null,
        "knowledge_format": null,
        "backend": "filemanager",
        "init_asset_id": null,
        "id": "4ff29904-4853-4a96-879a-7b8ea6618487",
        "created_at": "2022-01-07T11:25:21.366046",
        "updated_at": null,
        "artefact_type": "interlinker",
        "problemdomains": [],
        "questioncomments": []
      },
      {
        "name": "Google Drive",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus sapien, dapibus fringilla dolor sit amet, bibendum aliquam massa. Duis nec faucibus nunc. In sit amet vulputate justo. In dictum turpis eu dolor posuere vehicula. Sed turpis risus, vestibulum sed aliquam id, tempus nec dolor. Nulla facilisi. Suspendisse tempor pulvinar dignissim. Nulla dui ante, finibus in bibendum vel, dignissim nec risus. Nullam gravida nisi quis purus porttitor, sed hendrerit ante tristique. Donec eget augue vitae purus vehicula vehicula non sit amet lacus. Quisque porta nisi pharetra, fringilla felis id, porta arcu. Mauris vel elementum tortor. Ut sed magna id enim finibus molestie eu vitae leo. Mauris at sem elit. Fusce viverra accumsan orci et feugiat. Mauris ullamcorper molestie massa ac faucibus. Integer sit amet tellus tortor. Vivamus bibendum at libero at aliquet. Proin consectetur, erat et vulputate tincidunt, tortor quam euismod elit, id efficitur sem sapien tempus dolor. Aliquam a molestie risus. Nunc rutrum rutrum felis, in malesuada dolor porttitor nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc condimentum porta magna sed pharetra. In non quam dolor.",
        "logotype": "/static/demodata/interlinkers/googledrive.png",
        "published": true,
        "keywords": [],
        "documentation": "<>string</>",
        "SOC_type": "A11",
        "nature": "SW",
        "administrative_scope": null,
        "specific_app_domain": null,
        "constraints": null,
        "regulations": null,
        "software_type": null,
        "software_implementation": null,
        "software_customization": null,
        "software_integration": null,
        "knowledge_type": null,
        "knowledge_format": null,
        "backend": "googledrive",
        "init_asset_id": null,
        "id": "eed377b8-f332-4138-a9b9-3945fa394669",
        "created_at": "2022-01-07T11:25:21.380619",
        "updated_at": null,
        "artefact_type": "interlinker",
        "problemdomains": [],
        "questioncomments": []
      }
    ];
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
