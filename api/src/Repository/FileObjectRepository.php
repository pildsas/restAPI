<?php

namespace App\Repository;

use App\Entity\FileObject;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FileObject|null find($id, $lockMode = null, $lockVersion = null)
 * @method FileObject|null findOneBy(array $criteria, array $orderBy = null)
 * @method FileObject[]    findAll()
 * @method FileObject[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FileObjectRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FileObject::class);
    }

    // /**
    //  * @return FileObject[] Returns an array of FileObject objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?FileObject
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
