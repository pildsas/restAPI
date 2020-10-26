<?php

namespace App\Controller;

use App\Entity\Entry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class UploadImageController extends AbstractController
{
  
    public function __construct(ValidatorInterface $validator)
    {
        $this->validator = $validator;
    }

    public function __invoke(Request $request)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $fileName = '';

        $em = $this->getDoctrine()->getManager();
        $entry_id = $request->request->get('entry_id');
        $entry = $em->getRepository(Entry::class)->find($entry_id);

   
        if(isset($_FILES['imageFile'])){
            if($entry)
            {
                $fileName = $this->_upload($request);
                $entry->setImgPath($fileName);
               
            }
        }
        else if ($request->request->get('remove_img')) {
            if ($entry->getImgPath()) {
                $entry->setImgPath(null);
            }}

        $em->persist($entry);
        $em->flush();

        return $this->json($entry);

    }

    private function _upload($request)
    {

        $imgConstraint = new Assert\File(['maxSize'=>'3000k','mimeTypes'=>["image/jpeg", "image/png"]]);
 
        $errors = $this->validator->validate(
            $request->files->get('imageFile'),
            $imgConstraint
        );

    if (0 === count($errors)) {
        // ... this IS a valid img address, do something
    } else {
        // this is *not* a valid img address
        $errorMessage = $errors[0]->getMessage();

        return new Response($errorMessage);
    }

        // dd($request->files);
        $uploadedFile = $request->files->get('imageFile');
        

        if (!$uploadedFile)
        {
            throw new BadRequestHttpException('"file" is requidred');
        }

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $originalFilename);
        $fileName = $safeFilename . '-' . uniqid() . '.' . $uploadedFile->guessExtension();

        try {
            $uploadedFile->move('uploads/images/entries', $fileName);
        } catch (FileException $e) {
            // ... handle exception if something happens during file upload
            return;
        }

        return $fileName;
    }
}
