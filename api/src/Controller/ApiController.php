<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class ApiController extends AbstractController
{

   /**
     * @Route("/", name="login")
     */
    public function login(AuthenticationUtils $authenticationUtils)
    {
      if ($this->isGranted('ROLE_ADMIN')) {
        return $this->redirectToRoute('admin');
    }

      $user = $this->getUser();
      return $this->render('security/login.html.twig', [
          'user' => $user,
          'error' => $authenticationUtils->getLastAuthenticationError()
      ]);

    }


   /**
     * @Route("/api/status", name="login_status")
     */
    public function status()
    {
      if($this->getUser()){
         $code = 200;
         $email = $this->getUser()->getEmail();
      }
        return $this->json(['code' => $code, 'email' => $email], 200);
    }

}
