-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 08, 2012 at 08:16 AM
-- Server version: 5.1.44
-- PHP Version: 5.3.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `outletdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `batch_request`
--

CREATE TABLE IF NOT EXISTS `batch_request` (
  `date` date NOT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `batch_request`
--


-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE IF NOT EXISTS `inventory` (
  `barcode` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `selling_price` float NOT NULL,
  `min_stock` int(11) NOT NULL,
  PRIMARY KEY (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`barcode`, `stock`, `selling_price`, `min_stock`) VALUES
(18243337, 5, 232, 33),
(51336619, 9, 11, 11),
(59030623, 10, 111, 10);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `barcode` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `cost_price` float NOT NULL,
  `category` varchar(150) NOT NULL,
  `manufacturer` varchar(150) NOT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`barcode`, `name`, `cost_price`, `category`, `manufacturer`, `status`) VALUES
(18243337, 'Highlighter pen with memo pad', 60.05, 'Grocery, Health & Beauty', '5385', 'DISCONTINUED'),
(51336619, 'A4 Leather Binder Retractable', 36.05, 'Grocery, Health & Beauty', '3195', 'DISCONTINUED'),
(59030623, 'BHC Golf Visor With Magnetic Marker', 26.85, 'Stop Smoking', '3325', 'DISCONTINUED');

-- --------------------------------------------------------

--
-- Table structure for table `request_details`
--

CREATE TABLE IF NOT EXISTS `request_details` (
  `date` date NOT NULL,
  `barcode` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`date`,`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `request_details`
--


-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE IF NOT EXISTS `transaction` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `cashier_id` int(11) NOT NULL,
  `unit_sold` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `barcode` int(11) NOT NULL,
  PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`transaction_id`, `cashier_id`, `unit_sold`, `date`, `barcode`) VALUES
(1, 1, 1, '2012-11-07 12:33:24', 18243337),
(2, 1, 1, '2012-11-07 12:34:35', 18243337),
(3, 1, 1, '2012-11-07 12:34:35', 51336619),
(4, 1, 2, '2012-11-07 12:34:35', 18243337);
